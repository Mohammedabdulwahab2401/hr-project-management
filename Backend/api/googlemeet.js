const { google } = require("googleapis");
const moment = require("moment");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

async function createGoogleMeeting({ title, date, time, attendees }) {
  const startDateTime = moment(`${date}T${time}`).toISOString();
  const endDateTime = moment(startDateTime).add(1, "hour").toISOString();

  const event = {
    summary: title,
    start: { dateTime: startDateTime, timeZone: "UTC" },
    end: { dateTime: endDateTime, timeZone: "UTC" },
    attendees: attendees.map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2, 15)
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1
  });

  return response.data.conferenceData.entryPoints[0].uri;
}

module.exports = { createGoogleMeeting };
