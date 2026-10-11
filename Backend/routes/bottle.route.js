import { Router } from "express";
import multer from "multer";
import path from "path";
import { addBottle, getBottles, updateBottle, deleteBottle } from "../controller/bottle.controller.js";
import { checkToken, checkRole } from "../middleware/auth.middleware.js";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024, files: 2 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (file.fieldname === "modelFile") {
            if (ext === ".glb") {
                cb(null, true);
            } else {
                cb(new Error("Only .glb files are allowed for models"), false);
            }
        } else if (file.fieldname === "thumbnailFile") {
            if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
                cb(null, true);
            } else {
                cb(new Error("Only images (.jpg, .jpeg, .png, .webp) are allowed for thumbnails"), false);
            }
        } else {
            cb(new Error("Unknown field"), false);
        }
    }
});

const uploadFields = upload.fields([
    { name: "modelFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 }
]);

router.post("/", checkToken, checkRole(['admin']), uploadFields, addBottle);
router.get("/", getBottles);
router.put("/:id", checkToken, checkRole(['admin']), uploadFields, updateBottle);
router.delete("/:id", checkToken, checkRole(['admin']), deleteBottle);

export default router;
