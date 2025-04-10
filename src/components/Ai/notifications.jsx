import { useEffect, useState } from "react";

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/notifications", {
      headers: { "x-user-id": user.id },
    })
      .then((res) => res.json())
      .then(setNotifications);
  }, [user]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white p-3 shadow rounded w-64 z-50">
          <h4 className="font-bold">Your Summaries</h4>
          <ul className="text-sm max-h-60 overflow-y-auto">
            {notifications.map((note, i) => (
              <li key={i} className="border-b py-2">
                <p>{note.summary}</p>
                <p className="text-xs text-gray-400">{new Date(note.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
