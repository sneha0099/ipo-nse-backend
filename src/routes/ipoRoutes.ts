import { Router } from "express";
import {
  getIpoBySymbol,
  getIpoSubscriptions,
} from "../controllers/ipoController";

const router = Router();

// Get IPO by symbol
router.get("/:symbol", getIpoBySymbol);

// Get IPO subscriptions by symbol
router.get("/:symbol/subscriptions", getIpoSubscriptions);

export default router;
