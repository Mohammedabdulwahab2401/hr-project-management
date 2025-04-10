export async function createGoogleCalendarEvent(event, accessToken) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          conferenceData: {
            createRequest: {
              requestId: Math.random().toString(36).substring(2, 15),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
