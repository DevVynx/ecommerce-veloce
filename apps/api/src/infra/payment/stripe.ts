import Stripe from "stripe";

import { ENV } from "@/shared/utils/env";

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);
