import { Client } from 'node-appwrite';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET); // Use your test secret key here

export default async ({ req, res, log, error }) => {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  try {
    // Parse the request payload to get the amount
    const { amount } = JSON.parse(req.payload);
    
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Use the amount from the request
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Respond with the client secret
    return res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    // Log and respond with error
    error("Payment intent creation failed: " + err.message);
    return res.status(500).json({ error: err.message });
  }
};
