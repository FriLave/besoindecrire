import Stripe from 'stripe'

let client: Stripe | undefined

// Lazy: only fails when a payment code path actually runs without the key.
export const getStripe = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set (required by the payments module)')
  return (client ??= new Stripe(key))
}
