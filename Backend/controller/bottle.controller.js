import fs from "fs";
import path from "path";
import BottleModel from "../models/bottle.model.js";

export async function addBottle(req, res) {
    try {
        const { name, type, price } = req.body;

        const files = req.files;
        const modelPath = files && files.modelFile ? `/uploads/models/${files.modelFile[0].filename}` : null;
        const thumbnailPath = files && files.thumbnailFile ? `/uploads/thumbnails/${files.thumbnailFile[0].filename}` : null;

        if (!modelPath) {
            return res.status(400).json({ message: "GLB file is required" });
        }
        if (!thumbnailPath) {
            return res.status(400).json({ message: "Thumbnail image is required" });
        }

        const newBottle = new BottleModel({
            name,
            type,
            price,
            thumbnail: thumbnailPath,
            modelPath
        });

        await newBottle.save();

        return res.status(201).json({
            message: "Bottle model added successfully",
            bottle: newBottle
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Server error",
            error: e.message
        });
    }
}

export async function getBottles(req, res) {
    try {
        const bottles = await BottleModel.find();
        return res.status(200).json(bottles);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Server error",
            error: e.message
        });
    }
}

export async function updateBottle(req, res) {
    try {
        const { id } = req.params;
        const { name, type, price } = req.body;

        const bottle = await BottleModel.findById(id);
        if (!bottle) {
            return res.status(404).json({ message: "Bottle not found" });
        }

        const files = req.files;
        let modelPath = bottle.modelPath;
        let thumbnailPath = bottle.thumbnail;

        // If new files were uploaded, update the paths and delete old files from system
        if (files && files.modelFile) {
            if (modelPath && fs.existsSync("." + modelPath)) fs.unlinkSync("." + modelPath);
            modelPath = `/uploads/models/${files.modelFile[0].filename}`;
        }
        if (files && files.thumbnailFile) {
            if (thumbnailPath && fs.existsSync("." + thumbnailPath)) fs.unlinkSync("." + thumbnailPath);
            thumbnailPath = `/uploads/thumbnails/${files.thumbnailFile[0].filename}`;
        }

        bottle.name = name || bottle.name;
        bottle.type = type || bottle.type;
        bottle.price = price || bottle.price;
        bottle.modelPath = modelPath;
        bottle.thumbnail = thumbnailPath;

        await bottle.save();

        return res.status(200).json({
            message: "Bottle updated successfully",
            bottle
        });
    } catch (e) {
        console.error("Update error:", e);
        return res.status(500).json({
            message: "Server error during update",
            error: e.message
        });
    }
}

export async function deleteBottle(req, res) {
    try {
        const { id } = req.params;

        const bottle = await BottleModel.findById(id);
        if (!bottle) {
            return res.status(404).json({ message: "Bottle not found" });
        }

        // Cleanup associated files
        if (bottle.modelPath && fs.existsSync("." + bottle.modelPath)) {
            fs.unlinkSync("." + bottle.modelPath);
        }
        if (bottle.thumbnail && fs.existsSync("." + bottle.thumbnail)) {
            fs.unlinkSync("." + bottle.thumbnail);
        }

        await bottle.deleteOne();

        return res.status(200).json({ message: "Bottle deleted successfully" });
    } catch (e) {
        console.error("Delete error:", e);
        return res.status(500).json({
            message: "Server error during delete",
            error: e.message
        });
    }
}
