import configKeys from '../../config';
import Stripe from 'stripe';
import AppError from '../../utils/appError';
import HttpStatusCodes from '../../constants/HttpStatusCodes';

// Validate Stripe keys before initializing
if (!configKeys.STRIPE_SECRET_KEY || configKeys.STRIPE_SECRET_KEY.trim() === '') {
  console.warn('⚠️  STRIPE_SECRET_KEY is not configured in .env file');
}

if (!configKeys.STRIPE_PUBLISHABLE_KEY || configKeys.STRIPE_PUBLISHABLE_KEY.trim() === '') {
  console.warn('⚠️  STRIPE_PUBLISHABLE_KEY is not configured in .env file');
}

const stripe = configKeys.STRIPE_SECRET_KEY ? new Stripe(configKeys.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
}) : null;

export const paymentService = () => {
  const createPaymentIntent = async (amount:number) => {
    if (!stripe) {
      // For development: return mock payment intent when Stripe is not configured
      console.warn('⚠️  Stripe not configured - returning mock payment intent for development');
      return {
        id: 'pi_mock_' + Date.now(),
        object: 'payment_intent',
        amount: amount * 100,
        currency: 'inr',
        status: 'requires_payment_method',
        client_secret: 'pi_mock_' + Date.now() + '_secret_mock',
        created: Math.floor(Date.now() / 1000),
      };
    }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'INR',
        amount: amount*100,
        automatic_payment_methods: { enabled: true }
      });
      return paymentIntent;
    } catch (error: any) {
      console.error('Stripe payment intent creation error:', error);
      throw new AppError(
        error.message || 'Failed to create payment intent',
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  const getConfig = () => {
    if (!configKeys.STRIPE_PUBLISHABLE_KEY || configKeys.STRIPE_PUBLISHABLE_KEY.trim() === '') {
      // For development: return mock publishable key when Stripe is not configured
      console.warn('⚠️  Stripe publishable key not configured - returning mock key for development');
      return 'pk_test_mock_development_key_' + Date.now();
    }
    return configKeys.STRIPE_PUBLISHABLE_KEY;
  };

  return {
    createPaymentIntent,
    getConfig
  };
};

export type PaymentServiceImpl = typeof paymentService;
