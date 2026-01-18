import { Router } from "express";
import {
  getIpoBySymbol,
  getIpoSubscriptions,
} from "../controllers/ipoController";

const router = Router();

router.get("/:symbol", getIpoBySymbol);

router.get("/:symbol/subscriptions", getIpoSubscriptions);

export default router;
