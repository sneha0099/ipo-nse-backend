import { Request, Response } from "express";
import prisma from "../db";

export const getIpoBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const symbolStr = Array.isArray(symbol) ? symbol[0] : symbol;
    
    const ipo = await prisma.ipoDetails.findUnique({
      where: { symbol: symbolStr.toUpperCase() },
    });
    
    if (!ipo) {
      return res.status(404).json({
        success: false,
        message: `IPO with symbol ${symbolStr} not found`,
      });
    }
    
    res.json({
      success: true,
      data: ipo,
    });
  } catch (error: any) {
    console.error("Error fetching IPO:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch IPO details",
      error: error.message,
    });
  }
};

export const getIpoSubscriptions = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const symbolStr = Array.isArray(symbol) ? symbol[0] : symbol;
    
    const subscriptions = await prisma.ipoSubscription.findMany({
      where: { symbol: symbolStr.toUpperCase() },
      orderBy: [
        { serialNumber: "asc" },
        { createdAt: "desc" },
      ],
    });
    
    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No subscription data found for ${symbolStr}`,
      });
    }
    
    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription data",
      error: error.message,
    });
  }
};
