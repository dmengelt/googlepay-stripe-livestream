import 'dotenv/config';
import Stripe from 'stripe';
import express from 'express';

// Initialize Stripe library 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

// Create new express app
const app: express.Application = express();

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

app.listen(3000, () => console.log('Running on port 3000'));