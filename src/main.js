import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET);

export default async (req, res) => {
  try {
    const { amount } = JSON.parse(req.payload);

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10), // Convert to integer if needed
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
