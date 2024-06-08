import { useEffect, useState, useRef } from "react";
import { getCalendarList, addEmail } from "../Utilities/ConnectionHub";
import { useNavigate } from "react-router-dom";
import Calendar from "../Types/Calendar";

export default function CalendarList() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const [calendarList, setCalendarList] = useState<Calendar[] | []>([]);
  const [myCalendar, setMyCalendar] = useState<Calendar | null>(null);
  const [emailList, setEmailList] = useState<string[] | []>([]);

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

    async function fetchEmailList() {
      try {
        const response = await getCalendarList();
        console.log(`Emails: ${response.data.emails}`);
        setEmailList(response.data.emails ?? []);
      } catch {
        alert("Failed to fetch email list");
      }
    }

    fetchEmailList();
    fetchCalendarList();
  }, []);
  async function handleAddEmail() {
    const newEmail = emailRef.current?.value;
    if (!newEmail) {
      alert("Email is required");
      return;
    }
    if (emailList.includes(newEmail)) {
      alert("Email already exists");
      return;
    }
    try {
      await addEmail(newEmail);
      setEmailList((prev) => [...prev, newEmail]);
    } catch (e) {
      alert(`Failed to add email: ${e}`);
    }
  }

  return (
    <div>
      <h1>Calendar List</h1>
      <div>
        <h2
          onClick={() => {
            const url = `/calendar/${myCalendar?._id}/${myCalendar?.name}/true`;
            console.log(url);
            navigate(url);
          }}
        >
          {" "}
          My Calendar
        </h2>
        <div>
          <label>Add Email:</label>
          <input type="email" ref={emailRef} />
          <button onClick={handleAddEmail}>Confirm</button>
        </div>
      </div>
      <div>
        <h2>Shared Calendars</h2>
        {calendarList.map((calendar) => {
          return (
            <h3
              key={calendar._id}
              onClick={() => {
                const url = `/calendar/${calendar._id}/${calendar.name}/false`;
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
