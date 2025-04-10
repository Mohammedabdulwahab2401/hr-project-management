
export async function createZoomMeeting(meeting) {
    const startDateTime = new Date(`${meeting.date}T${meeting.time}`);
    
    const meetingData = {
      topic: meeting.title,
      type: 2,
      start_time: startDateTime.toISOString(),
      duration: 60,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
      },
    };
  
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JSON.parse(import.meta.env.ZOOM_ACCESS_TOKEN).access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });
  
    return response.json();
  }
  