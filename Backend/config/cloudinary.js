import { v2 as cloudinary } from "cloudinary";
import { randomBytes } from "crypto";

const requiredCloudinaryEnv = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];

export function assertCloudinaryConfigured() {
    const missing = requiredCloudinaryEnv.filter((key) => !process.env[key]);
    if (missing.length) {
        throw new Error(`Cloudinary configuration is missing: ${missing.join(", ")}`);
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
}

export function uploadBottleAsset(file, kind) {
    assertCloudinaryConfigured();

    const isModel = kind === "model";
    const resourceType = isModel ? "raw" : "image";
    const folder = isModel ? "printify3d/models" : "printify3d/thumbnails";
    const extension = isModel ? ".glb" : "";
    const publicId = `bottle-${Date.now()}-${randomBytes(6).toString("hex")}${extension}`;

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, public_id: publicId, resource_type: resourceType, overwrite: false },
            (error, result) => {
                if (error) return reject(error);
                if (!result?.secure_url || !result.public_id) {
                    return reject(new Error("Cloudinary returned an incomplete upload result"));
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    resourceType
                });
            }
        );
        stream.end(file.buffer);
    });
}

export async function deleteBottleAsset(publicId, resourceType) {
    if (!publicId) return;
    assertCloudinaryConfigured();
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
