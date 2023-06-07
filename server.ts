import 'dotenv/config';
import Stripe from 'stripe';
import express from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

const app: express.Application = express();

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.get('/payment_sheet', async (req: express.Request, res: express.Response) => {
  const customer: Stripe.Customer = await stripe.customers.create();

  const ephemeralKey: Stripe.EphemeralKey = await stripe.ephemeralKeys.create({
    customer: customer.id,
  }, {
    apiVersion: '2022-11-15',
  });

  const paymentIntent:Stripe.PaymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    }
  });

  return res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post('/webhook', express.raw({type: 'application/json'}), async (req: express.Request, res: express.Response) => {
  let event: Stripe.Event = req.body;

  const signature: string = req.headers['stripe-signature'] as string;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {    
    case 'payment_intent.succeeded':
        const paymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    
    default: 
      //unexpected event type
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.send(200);
});

app.listen(3000, () => console.log('Running on port 3000'));