const express = require('express');
const fs = require('fs');
const path = require('path');
const calendar = require('./integrations/calendar');
const payments = require('./integrations/payments');

const app = express();
app.use(express.json());

// --- Config loading -------------------------------------------------
// Each client gets one JSON file in /configs. Swapping clients = adding
// a file here, not touching this server's code.
function loadClientConfig(clientId) {
  const filePath = path.join(__dirname, 'configs', `${clientId}-config.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No config found for client_id "${clientId}"`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// --- Function endpoints (these are what Vapi/Retell calls) ----------

app.post('/check_availability', async (req, res) => {
  try {
    const { client_id, start_date, end_date, service_type } = req.body;
    const config = loadClientConfig(client_id);
    const slots = await calendar.checkAvailability(config, start_date, end_date, service_type);
    res.json({ available_slots: slots });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/book_appointment', async (req, res) => {
  try {
    const { client_id, customer_name, phone_number, service_address, service_type, start_time, notes } = req.body;
    const config = loadClientConfig(client_id);
    const result = await calendar.bookAppointment(config, {
      customer_name, phone_number, service_address, service_type, start_time, notes
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/reschedule_appointment', async (req, res) => {
  try {
    const { client_id, appointment_id, new_start_time } = req.body;
    const config = loadClientConfig(client_id);
    const result = await calendar.rescheduleAppointment(config, appointment_id, new_start_time);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/send_payment_link', async (req, res) => {
  try {
    const { client_id, customer_name, phone_number, amount_usd, invoice_id } = req.body;
    const config = loadClientConfig(client_id);

    if (config.payment && config.payment.collect_payment_on_call === false) {
      return res.status(400).json({
        error: `Config for ${client_id} has collect_payment_on_call set to false — confirm with the client before enabling this.`
      });
    }

    const result = await payments.sendPaymentLink(config, { customer_name, phone_number, amount_usd, invoice_id });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/transfer_to_human', async (req, res) => {
  try {
    const { client_id, reason, priority } = req.body;
    const config = loadClientConfig(client_id);
    const target = config.escalation.human_handoff;
    res.json({
      transfer_to: target.phone,
      transfer_to_name: target.name,
      reason,
      priority: priority || 'normal'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Agent backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Agent backend listening on port ${PORT}`));
