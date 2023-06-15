import 'dotenv/config';
import Stripe from 'stripe';
import express from 'express';

// Initialize Stripe library 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

// Create new express app
const app: express.Application = express();

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.get('/payment_intent', async (req: express.Request, res: express.Response) => {
  const customer: Stripe.Customer = await stripe.customers.create();

  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'eur',
    customer: customer.id,
  });

  return res.json({
    paymentIntent: paymentIntent.client_secret,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get('/payment_sheet', async (req: express.Request, res: express.Response) => {
  const customer: Stripe.Customer = await stripe.customers.create();

  const ephemeralKey: Stripe.EphemeralKey = await stripe.ephemeralKeys.create({
    customer: customer.id,
  }, {
    apiVersion: '2022-11-15',
  });

  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'eur',
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return res.json({
    paymentIntent: paymentIntent.client_secret,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    customer: customer.id,
    ephemeralKey: ephemeralKey.secret,
  });
});

app.post('/webhook', express.raw({type: 'application/json'}), async (req: express.Request, res: express.Response) => {
  const signature: string = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.log(err.message);
    return res.status(400).send(`Webhook signature mismatch`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded for amount ${paymentIntent.amount}! Hooray!`);
      // business logic
      break;
  }

  return res.sendStatus(200);
});

app.listen(3000, () => console.log('Running on port 3000'));