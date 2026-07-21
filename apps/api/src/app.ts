import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import { authRouter } from "@/modules/auth/routes";
import { cartRouter } from "@/modules/cart/routes";
import { couponRouter } from "@/modules/coupon/routes";
import { dashboardRouter } from "@/modules/dashboard/routes";
import { orderRouter } from "@/modules/order/routes";
import { promotionRouter } from "@/modules/promotion/routes";
import { reviewRouter } from "@/modules/review/routes";
import { shippingRouter } from "@/modules/shipping/routes";
import { userRouter } from "@/modules/user/routes";
import { wishlistRouter } from "@/modules/wishlist/routes";
import { handleGlobalError } from "@/shared/middlewares/handleGlobalError";
import { notFoundHandler } from "@/shared/middlewares/notFoundHandler";
import { ENV } from "@/shared/utils/env";

import { productRouter } from "./modules/product/routes";
import { searchRouter } from "./modules/search/routes";

export const app: Express = express();

// Configs -----------------------------------------------------------
app.use(
  express.json({
    verify: (req, _res, buf, _encoding) => {
      (req as express.Request).rawBody = buf;
    },
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", `http://${ENV.IP_ADDRESS}:3000`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Routes ------------------------------------------------------------
app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", couponRouter);
app.use("/api", dashboardRouter);
app.use("/api", userRouter);
app.use("/api", wishlistRouter);
app.use("/api", shippingRouter);
app.use("/api", searchRouter);
app.use("/api", orderRouter);
app.use("/api", promotionRouter);
app.use("/api", reviewRouter);

app.use(notFoundHandler);
app.use(handleGlobalError);
