import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Event from "../Types/Event";
import AddEventFormModal from "../Components/CalendarView/AddEventFormModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  addEvent,
  deleteEvent,
  updateEvent,
  getEvents,
} from "../Utilities/ConnectionHub";

export default function CalendarMainView() {
  const { calendar_id, owner, ownerShip } = useParams();
  const [eventList, setEventList] = useState<Event[]>([]);
  const [addEventModal, setAddEventModal] = useState<boolean>(false);

  function handleEventClick({ event }) {
    alert(`Event: ${event.name}\nStart: ${event.start}`);
  }

  useEffect(() => {
    if (!calendar_id) {
      return;
    }
    async function fetchEvents() {
      try {
        if (!calendar_id) {
          throw new Error("Calendar id is not provided");
        }
        const response = await getEvents(calendar_id);
        setEventList(response.data);
      } catch {
        alert("Failed to fetch events");
      }
    }
    fetchEvents();
  }, [calendar_id]);

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

  function handleAddEvent() {
    setAddEventModal(!addEventModal);
  }

  async function addEventInCalendar(
    name: string,
    date: Date,
    description?: string
  ) {
    try {
      const newEvent: Event = { name, start: date, description };
      if (!calendar_id) {
        throw new Error("Calendar id is not provided");
      }
      await addEvent(newEvent, calendar_id);
      setEventList((prevEvents) => {
        return [...prevEvents, newEvent];
      });
      setAddEventModal(false);
    } catch (error) {
      alert("Failed to add event" + error);
    }
  }
  return (
    <div>
      <h1>{owner}</h1>
      <button onClick={handleAddEvent}> Add Event </button>
      <AddEventFormModal
        addEvent={addEventInCalendar}
        shouldAppear={addEventModal}
      />
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
