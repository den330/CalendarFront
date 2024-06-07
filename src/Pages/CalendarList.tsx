import { useEffect, useState } from "react";
import { getCalendarList } from "../Utilities/ConnectionHub";
import { useNavigate } from "react-router-dom";
import Calendar from "../Types/Calendar";

export default function CalendarList() {
  const navigate = useNavigate();
  const [calendarList, setCalendarList] = useState<Calendar[] | []>([]);
  const [myCalendar, setMyCalendar] = useState<Calendar | null>(null);

  useEffect(() => {
    async function fetchCalendarList() {
      try {
        const response = await getCalendarList();
        setCalendarList(response.data.accessibleCalendars);
        setMyCalendar(response.data.ownCalendar);
      } catch {
        alert("Failed to fetch calendar list");
      }
    }
    fetchCalendarList();
  }, []);
  return (
    <div>
      <h1>Calendar List</h1>
      <div>
        <h2
          onClick={() => {
            const url = `/calendar/${myCalendar?.__id}/${myCalendar?.name}/true`;
            navigate(url);
          }}
        >
          {" "}
          My Calendar
        </h2>
      </div>
      <div>
        <h2>Shared Calendars</h2>
        {calendarList.map((calendar) => {
          return (
            <h3
              key={calendar.__id}
              onClick={() => {
                const url = `/calendar/${calendar.__id}/${calendar.name}/false`;
                navigate(url);
              }}
            >
              {calendar.name}
            </h3>
          );
        })}
      </div>
    </div>
  );
}
