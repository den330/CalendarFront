import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Event from "../../Types/Event";
import { useState } from "react";
import {
  addEvent,
  deleteEvent,
  updateEvent,
  getEvents,
} from "../../Utilities/ConnectionHub";

//Attention: need to change, it should only require calendarId, and then fetch events from the server by itself.
export default function CalendarMainView({
  events,
  owner,
}: {
  events: Event[];
  owner: string;
}) {
  const [eventList, setEventList] = useState<Event[]>(events);

  function handleEventClick({ event }) {
    alert(`Event: ${event.name}\nStart: ${event.start}`);
  }

  async function deleteEvent(eventId: string) {
    try {
      await deleteEvent(eventId);
      setEventList((prevEvents) => {
        return prevEvents.filter((event) => event.__id !== eventId);
      });
    } catch {
      alert("Failed to delete event");
    }
  }

  function handleAddEvent() {}
  return (
    <div>
      <h1>{owner}</h1>
      <button onClick={handleAddEvent}> Add Event </button>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={eventList}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />
    </div>
  );
}

function renderEventContent(eventInfo: { timeText: string; event: Event }) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.name}</i>
    </>
  );
}
