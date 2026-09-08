// --- Google Calendar integration -----------------------------------
// Everything here is mocked so the backend is testable before a real
// Google Calendar / API credentials exist for a client.
//
// To go live: replace the bodies of these functions with calls to the
// Google Calendar API (googleapis npm package), using
// config.calendar.google_calendar_id to know which calendar to read/write.
// You'll need a service account JSON key with that calendar shared to it —
// see the owner checklist for how the client grants access.

async function checkAvailability(config, startDate, endDate, serviceType) {
  // TODO: replace with a real freebusy/events.list call to Google Calendar,
  // using config.calendar.google_calendar_id and config.calendar.appointment_duration_minutes
  // to generate real open slots.
  return [
    { start_time: `${startDate}T09:00:00`, end_time: `${startDate}T10:00:00` },
    { start_time: `${endDate}T13:00:00`, end_time: `${endDate}T14:00:00` }
  ];
}

async function bookAppointment(config, details) {
  // TODO: replace with a real events.insert call to Google Calendar
  console.log(`[MOCK] Booking appointment for ${config.client_id}:`, details);
  return {
    appointment_id: `mock-${Date.now()}`,
    status: 'confirmed',
    ...details
  };
}

async function rescheduleAppointment(config, appointmentId, newStartTime) {
  // TODO: replace with a real events.patch call to Google Calendar
  console.log(`[MOCK] Rescheduling ${appointmentId} to ${newStartTime}`);
  return {
    appointment_id: appointmentId,
    new_start_time: newStartTime,
    status: 'rescheduled'
  };
}

module.exports = { checkAvailability, bookAppointment, rescheduleAppointment };
