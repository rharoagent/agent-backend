// --- Stripe payment integration --------------------------------------
// Mocked for now. To go live:
// 1. npm install stripe
// 2. Use config.payment.stripe_account_id (the CLIENT's Stripe account,
//    not yours) with Stripe Connect, or use a per-client secret key if
//    not using Connect.
// 3. Create a real Payment Link via stripe.paymentLinks.create(), then
//    send it by SMS via Twilio's API to phone_number.
//
// IMPORTANT: this backend should never receive or store raw card numbers.
// Only amounts and links pass through here — the customer enters card
// details on Stripe's own hosted page.

async function sendPaymentLink(config, { customer_name, phone_number, amount_usd, invoice_id }) {
  // TODO: replace with a real stripe.paymentLinks.create() call using
  // config.payment.stripe_account_id, then send the resulting URL via
  // Twilio SMS to phone_number.
  const mockLink = `https://pay.stripe.com/mock/${config.client_id}/${Date.now()}`;
  console.log(`[MOCK] Sending payment link for $${amount_usd} to ${phone_number}: ${mockLink}`);
  return {
    status: 'sent',
    payment_link: mockLink,
    amount_usd,
    invoice_id: invoice_id || null
  };
}

module.exports = { sendPaymentLink };
