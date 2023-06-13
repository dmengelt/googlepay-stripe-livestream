import 'dotenv/config';
import Stripe from 'stripe';
import express from 'express';

// Initialize Stripe library 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

// Create new express app
const app: express.Application = express();

app.listen(3000, () => console.log('Running on port 3000'));