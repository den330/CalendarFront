import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import MyEvent from "../Types/Event";
import AddEventFormModal from "../Components/CalendarView/AddEventFormModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventDetailView from "../Components/CalendarView/EventDetailView";
import { v4 as uuidv4 } from "uuid";
import { deleteEvent as deleteEventRemote } from "../Utilities/ConnectionHub";

import {
  addEvent,
  deleteEvent,
  updateEvent,
  getEvents,
} from "../Utilities/ConnectionHub";

export default function CalendarMainView() {
  const { calendar_id, owner, ownerShip } = useParams();
  const [eventList, setEventList] = useState<MyEvent[]>([]);
  const [addEventModal, setAddEventModal] = useState<boolean>(false);
  const [currentClickedEvent, setCurrentClickedEvent] = useState<object | null>(
    null
  );

  function handleEventClick({ event }) {
    console.log(`clicked event is ${JSON.stringify(event)}`);
    setCurrentClickedEvent(event as MyEvent);
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
      console.log(`deleting event with id ${eventId}`);
      await deleteEventRemote(eventId, calendar_id);
      setEventList((prevEvents) => {
        return prevEvents.filter((event) => event._id !== eventId);
      });
    } catch {
      alert("Failed to delete event");
    }
  }

  function handleAddEvent() {
    setAddEventModal(!addEventModal);
  }

  async function addEventInCalendar(
    title: string,
    date: Date,
    description?: string
  ) {
    try {
      const _id = uuidv4();
      const newEvent: MyEvent = { _id, title, start: date, description };
      if (!calendar_id) {
        throw new Error("Calendar id is not provided");
      }
      console.log(`new event is ${newEvent}, calendar id is ${calendar_id}`);
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
      <button onClick={handleAddEvent}> Add MyEvent </button>
      <AddEventFormModal
        addEvent={addEventInCalendar}
        shouldAppear={addEventModal}
      />
      <EventDetailView
        shouldOpen={currentClickedEvent !== null}
        event={currentClickedEvent!}
        deleteEvent={deleteEvent}
        onClose={() => setCurrentClickedEvent(null)}
      />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={eventList}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />
    </div>
  );
}

function renderEventContent(eventInfo: { timeText: string; event: MyEvent }) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
