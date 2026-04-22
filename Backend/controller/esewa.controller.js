import crypto from "crypto";
import axios from "axios";
import fs from "fs";
import path from "path";
import OrderModel from "../models/order.model.js";

export async function initiateEsewaPayment(req, res) {
    try {
        const { amount, productName, customerDetails, designImage, bottlePreviewImage } = req.body;

        console.log("=== ST-10: Base64 Snapshot:");
        if (designImage) {
            console.log("DESIGN B64:", designImage.substring(0, 100) + "...");
        }
        if (bottlePreviewImage) {
            console.log("PREVIEW B64:", bottlePreviewImage.substring(0, 100) + "...");
        }


        if (!amount || !productName || !customerDetails) {
            return res.status(400).json({ message: "Amount, productName, and customerDetails are required" });
        }

        const transaction_uuid = `${Date.now()}`;

        let designImagePath = null;
        if (designImage) {
            // Check if it's base64 encoded image
            const matches = designImage.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const buffer = Buffer.from(matches[2], 'base64');
                const extension = matches[1];
                const fileName = `design_${transaction_uuid}.${extension === 'png' ? 'png' : 'jpg'}`;
                const uploadDir = path.join(process.cwd(), 'uploads');

                // Create uploads directory if it doesn't exist
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, buffer);
                designImagePath = `/uploads/${fileName}`;
            }
        }

        let bottlePreviewImagePath = null;
        if (bottlePreviewImage) {
            // Check if it's base64 encoded image
            const matches = bottlePreviewImage.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const buffer = Buffer.from(matches[2], 'base64');
                const extension = matches[1];
                const fileName = `preview_${transaction_uuid}.${extension === 'png' ? 'png' : 'jpg'}`;
                const uploadDir = path.join(process.cwd(), 'uploads');

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, buffer);
                bottlePreviewImagePath = `/uploads/${fileName}`;
            }
        }

        const pendingOrder = new OrderModel({
            orderId: `PENDING_${transaction_uuid}`,
            productName,
            amount: Number(amount),
            customerName: customerDetails.name,
            phoneNumber: customerDetails.phone,
            address: customerDetails.address,
            paymentMethod: "eSewa",
            paymentStatus: "Pending",
            transactionUuid: transaction_uuid,
            designImage: designImagePath,
            bottlePreviewImage: bottlePreviewImagePath
        });

        await pendingOrder.save();
        console.log("Pending order created:", transaction_uuid);
        const product_code = (process.env.ESEWA_PRODUCT_CODE || "EPAYTEST").trim();
        const secret_key = (process.env.ESEWA_SECRET_KEY || "8g7h9z6l!.").trim();

        // Ensure amount is handled consistently
        const formatted_amount = Number(amount).toString();

        const message = `total_amount=${formatted_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

        console.log("--- eSewa Signature Debug ---");
        console.log("Secret Key (trimmed):", secret_key);
        console.log("Message for Signature:", message);

        const hash = crypto.createHmac('sha256', secret_key).update(message).digest('base64');

        console.log("Generated Signature:", hash);
        console.log("-----------------------------");

        const formData = {
            amount: formatted_amount,
            failure_url: `${(process.env.CORS_ORIGIN || 'http://localhost:5173').trim()}/preview`,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: product_code,
            signature: hash,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: `${(process.env.CORS_ORIGIN || 'http://localhost:5173').trim()}/preview`,
            tax_amount: "0",
            total_amount: formatted_amount,
            transaction_uuid: transaction_uuid
        };

        const responsePayload = {
            message: "eSewa payment initiated",
            formData,
            gatewayUrl: (process.env.ESEWA_GATEWAY_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form").trim()
        };

        console.log("Sending successful response to frontend:", JSON.stringify(responsePayload, null, 2));
        return res.status(200).json(responsePayload);

    } catch (error) {
        console.error("eSewa initiation error:", error);
        return res.status(500).json({ message: "Failed to initiate eSewa payment", error: error.message });
    }
}

export async function verifyEsewaPayment(req, res) {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ message: "Verification data is missing" });
        }

        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        console.log("eSewa Decoded Success Data:", decodedData);

        if (decodedData.status === "COMPLETE") {
            // Find the pending order by transactionUuid
            const existingOrder = await OrderModel.findOne({ transactionUuid: decodedData.transaction_uuid });

            if (!existingOrder) {
                console.error("Order not found for verification:", decodedData.transaction_uuid);
                return res.status(404).json({ message: "Order not found" });
            }

            // If already paid, return success (Idempotency)
            if (existingOrder.paymentStatus === "Paid") {
                return res.status(200).json({
                    message: "Payment already verified",
                    order: existingOrder
                });
            }

            // Update the existing order
            existingOrder.orderId = decodedData.transaction_code;
            existingOrder.paymentStatus = "Paid";

            try {
                await existingOrder.save();
                return res.status(200).json({
                    message: "Payment successful and verified",
                    order: existingOrder
                });
            } catch (saveError) {
                if (saveError.code === 11000) {
                    const savedOrder = await OrderModel.findOne({ orderId: decodedData.transaction_code });
                    return res.status(200).json({
                        message: "Payment verified (handled duplicate)",
                        order: savedOrder
                    });
                }
                throw saveError;
            }
        } else {
            return res.status(400).json({ message: "Payment status is not COMPLETE", details: decodedData });
        }

    } catch (error) {
        console.error("--- eSewa Verification Error Detail ---");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.errors) {
            console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
        }
        console.error("Full Error:", error);
        console.error("---------------------------------------");
        return res.status(500).json({
            message: "Payment verification failed",
            error: error.message,
            details: error.name === 'ValidationError' ? error.errors : undefined
        });
    }
}

export async function getOrders(req, res) {
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}
