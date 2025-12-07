import { Router } from "express";
import {
  getBirdsHandler,
  getBirdByIdHandler,
  createBirdHandler,
  updateBirdHandler,
  deleteBirdHandler,
} from "../controllers/birds.controller";

const router = Router();

router.get("/", getBirdsHandler);
router.get("/:id", getBirdByIdHandler);
router.post("/", createBirdHandler);
router.put("/:id", updateBirdHandler);
router.delete("/:id", deleteBirdHandler);

export default router;
