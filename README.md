# Collect payments on Android with Google Pay and Stripe

Backend source code used for the following livestreams:
- [Collect payments on Android with Google Pay and Stripe](https://www.youtube.com/watch?v=fbkfB-FAaMg)
- [Collect payments on Android with Google Pay and Stripe’s React Native SDK](https://www.youtube.com/watch?v=hlnrL88Lyzc)

## Running the server
1. `npm i`
2. `mv .env.example .env`
3. Add your Stripe webhook signing secret, publishable and secret key from your [Stripe dashboard](https://dashboard.stripe.com/apikeys) to the `.env` file
4. `npm start` to run the server

## Testing
Running `curl localhost:3000/payment_sheet` should return you an object with an ephemeral key, PaymentIntent client secret, customer ID and publishable key.