import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    productName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "eSewa"
    },
    paymentStatus: {
        type: String,
        required: true,
        default: "Pending" // Paid, Failed
    },
    transactionUuid: {
        type: String,
        required: false
    },
    paymentToken: {
        type: String,
        required: false
    },
    designImage: {
        type: String, // store path to the uploaded image / texture
        required: false
    },
    bottlePreviewImage: {
        type: String, // store path to the 3D bottle preview
        required: false
    }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
