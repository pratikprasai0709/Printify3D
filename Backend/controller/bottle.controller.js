import BottleModel from "../models/bottle.model.js";
import { deleteBottleAsset, uploadBottleAsset } from "../config/cloudinary.js";

async function cleanUpAssets(assets) {
    await Promise.all(assets.map(async (asset) => {
        try {
            await deleteBottleAsset(asset.publicId, asset.resourceType);
        } catch (error) {
            console.error("Cloudinary cleanup failed:", error.message);
        }
    }));
}

export async function addBottle(req, res) {
    const uploadedAssets = [];
    try {
        const { name, type, price } = req.body;
        const modelFile = req.files?.modelFile?.[0];
        const thumbnailFile = req.files?.thumbnailFile?.[0];

        if (!modelFile) {
            return res.status(400).json({ message: "GLB file is required" });
        }
        if (!thumbnailFile) {
            return res.status(400).json({ message: "Thumbnail image is required" });
        }

        const modelAsset = await uploadBottleAsset(modelFile, "model");
        uploadedAssets.push(modelAsset);
        const thumbnailAsset = await uploadBottleAsset(thumbnailFile, "thumbnail");
        uploadedAssets.push(thumbnailAsset);

        const newBottle = new BottleModel({
            name,
            type,
            price,
            thumbnail: thumbnailAsset.url,
            thumbnailPublicId: thumbnailAsset.publicId,
            modelPath: modelAsset.url,
            modelPublicId: modelAsset.publicId
        });

        await newBottle.save();

        return res.status(201).json({
            message: "Bottle model added successfully",
            bottle: newBottle
        });
    } catch (error) {
        await cleanUpAssets(uploadedAssets);
        console.error("Add bottle error:", error);
        const configurationError = error.message?.includes("Cloudinary configuration is missing");
        return res.status(configurationError ? 503 : 500).json({
            message: configurationError
                ? "Cloudinary is not configured on the backend"
                : "Server error while uploading the bottle",
            error: error.message
        });
    }
}

export async function getBottles(req, res) {
    try {
        const bottles = await BottleModel.find();
        return res.status(200).json(bottles);
    } catch (error) {
        console.error("Get bottles error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

export async function updateBottle(req, res) {
    const uploadedAssets = [];
    try {
        const { id } = req.params;
        const { name, type, price } = req.body;
        const bottle = await BottleModel.findById(id);
        if (!bottle) {
            return res.status(404).json({ message: "Bottle not found" });
        }

        const oldAssets = [];
        const modelFile = req.files?.modelFile?.[0];
        const thumbnailFile = req.files?.thumbnailFile?.[0];

        if (modelFile) {
            const asset = await uploadBottleAsset(modelFile, "model");
            uploadedAssets.push(asset);
            if (bottle.modelPublicId) {
                oldAssets.push({ publicId: bottle.modelPublicId, resourceType: "raw" });
            }
            bottle.modelPath = asset.url;
            bottle.modelPublicId = asset.publicId;
        }
        if (thumbnailFile) {
            const asset = await uploadBottleAsset(thumbnailFile, "thumbnail");
            uploadedAssets.push(asset);
            if (bottle.thumbnailPublicId) {
                oldAssets.push({ publicId: bottle.thumbnailPublicId, resourceType: "image" });
            }
            bottle.thumbnail = asset.url;
            bottle.thumbnailPublicId = asset.publicId;
        }

        if (name) bottle.name = name;
        if (type) bottle.type = type;
        if (price !== undefined && price !== "") bottle.price = Number(price);

        await bottle.save();
        await cleanUpAssets(oldAssets);

        return res.status(200).json({
            message: "Bottle updated successfully",
            bottle
        });
    } catch (error) {
        await cleanUpAssets(uploadedAssets);
        console.error("Update bottle error:", error);
        const configurationError = error.message?.includes("Cloudinary configuration is missing");
        return res.status(configurationError ? 503 : 500).json({
            message: configurationError
                ? "Cloudinary is not configured on the backend"
                : "Server error during bottle update",
            error: error.message
        });
    }
}

export async function deleteBottle(req, res) {
    try {
        const bottle = await BottleModel.findById(req.params.id);
        if (!bottle) {
            return res.status(404).json({ message: "Bottle not found" });
        }

        await bottle.deleteOne();
        await cleanUpAssets([
            { publicId: bottle.modelPublicId, resourceType: "raw" },
            { publicId: bottle.thumbnailPublicId, resourceType: "image" }
        ].filter((asset) => asset.publicId));

        return res.status(200).json({ message: "Bottle deleted successfully" });
    } catch (error) {
        console.error("Delete bottle error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}
