/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from "express";
import Stripe from "stripe";

import { orderServices } from "@/modules/orders/services";
import { ENV } from "@/shared/utils/env";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

const successEvents = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];

const failureEvents = ["checkout.session.expired", "checkout.session.async_payment_failed"];

export const stripeWebhook: RequestHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const payload = req.body;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    res.status(400).json({ error: `Webhook error: ${error.message}` });
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id;

  if (!orderId) {
    res.status(200).json({ received: true });
    return;
  }

  if (successEvents.includes(event.type)) {
    if (session.payment_status === "paid") {
      await orderServices.confirmPayment({ orderId });
    }
  }

  if (failureEvents.includes(event.type)) {
    await orderServices.cancelOrder({ orderId });
  }

  res.status(200).json({ received: true });
};
