import express from "express";
import cors from "cors";
import ipoRoutes from "./routes/ipoRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "IPO Backend API",
    version: "1.0.0",
    endpoints: {
      ipoBySymbol: "/api/ipos/:symbol",
      subscriptions: "/api/ipos/:symbol/subscriptions"
    },
  });
});

app.use("/api/ipos", ipoRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

export default app;
