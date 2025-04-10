const axios = require("axios");

async function createZoomMeeting({ title, date, time }, accessToken) {
  const startDateTime = new Date(`${date}T${time}:00`).toISOString();

  const response = await axios.post(
    'https://api.zoom.us/v2/users/me/meetings',
    {
      topic: title,
      type: 2,
      start_time: startDateTime,
      duration: 60,
      timezone: 'UTC',
      settings: {
        join_before_host: false,
        approval_type: 0,
        registration_type: 1,
        enforce_login: false,
        waiting_room: true
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.join_url;
}

module.exports = { createZoomMeeting };
