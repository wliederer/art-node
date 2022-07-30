import "dotenv/config";
import express, { Response, Request } from "express";
import artRouter from "./routes/art.routes";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import Strategy from "passport-auth-token";
import { publicCorsConfig } from "./constants/corsOptions";
import Stripe from "stripe";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 8080;
app.use(morgan("combined"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

passport.use(
  "token",
  new Strategy(async (token, done) => {
    if (token && token === process.env.TOKEN) {
      return done(null, token);
    } else {
      return done(null, false);
    }
  })
);
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === "/webhook") {
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  }
);

app.post(
  "/stripe/charge",
  async (req: Request, res: Response): Promise<void> => {
    const { amount, id } = req.body;
    try {
      const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "USD",
        description: "stickers",
        payment_method: id,
        confirm: true,
      });
      res.json({
        message: "Payment Successful",
        success: true,
      });
    } catch (error) {
      res.json({
        message: "Payment Failed",
        success: false,
      });
    }
  }
);

app.post(
  "/webhook",
  // Use body-parser to retrieve the raw body as a buffer.
  bodyParser.raw({ type: "application/json" }),
  async (req: express.Request, res: express.Response): Promise<void> => {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        String(req.headers["stripe-signature"]),
        String(process.env.STRIPE_WEBHOOK_SECRET)
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      res.sendStatus(400);
      return;
    }

    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;

    if (eventType === "payment_intent.succeeded") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
      // Funds have been captured
      // Fulfill any orders, e-mail receipts, etc
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
      console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      console.log("💰 Payment captured!");
    } else if (eventType === "payment_intent.payment_failed") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
      console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
  }
);
app.use(artRouter);

app.get("/health", cors(publicCorsConfig), (req: Request, res: Response) => {
  res.send("ok");
});

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
  apiVersion: "2020-08-27",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "stripe-samples/accept-a-payment",
    url: "https://github.com/stripe-samples",
    version: "0.0.2",
  },
  typescript: true,
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
