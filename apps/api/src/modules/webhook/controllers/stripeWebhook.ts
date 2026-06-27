/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from "express";
import Stripe from "stripe";

import { orderServices } from "@/modules/orders/services";
import { ENV } from "@/shared/utils/env";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

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

  const succedEventTypes = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
  ];

  if (succedEventTypes.includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const paymentStatus = session.payment_status;
    if (paymentStatus) {
      if (orderId) await orderServices.confirmPayment({ orderId });
    }
  } 

  res.status(200).json({ received: true });
};
