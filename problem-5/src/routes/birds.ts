import { Router } from "express";
import {
  getBirds,
  getBirdById,
  createBirdHandler,
  updateBirdHandler,
  deleteBirdHandler,
} from "../controllers/birds.controller";

const router = Router();

router.get("/", getBirds);
router.get("/:id", getBirdById);
router.post("/", createBirdHandler);
router.put("/:id", updateBirdHandler);
router.delete("/:id", deleteBirdHandler);

export default router;
