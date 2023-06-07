# googlepay-stripe-livestream

Source for the livestream on 2023-06-15

## Running the server
1. `npm i`
2. `mv .env.example .env`
3. Add your Stripe publishable and secret key from your [Stripe dashboard](https://dashboard.stripe.com/apikeys) to the `.env` file
4. `npm start` to run the server

## Testing
Running `curl localhost:3000/payment_sheet` should return you an object with an ephemeral key, PaymentIntent client secret, customer ID and publishable key.