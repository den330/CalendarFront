import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import MyEvent from "../Types/Event";
import AddEventFormModal from "../Components/CalendarView/AddEventFormModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventDetailView from "../Components/CalendarView/EventDetailView";
import crypto from "crypto";

import {
  addEvent,
  deleteEvent as deleteEventRemote,
  updateEvent as updateEventRemote,
  getEvents,
} from "../Utilities/ConnectionHub";

export default function CalendarMainView() {
  const { calendar_id, owner, ownerShip } = useParams();
  const [eventList, setEventList] = useState<MyEvent[]>([]);
  const [addEventModal, setAddEventModal] = useState<boolean>(false);
  const [currentClickedEvent, setCurrentClickedEvent] =
    useState<MyEvent | null>(null);

  function handleEventClick({ event }) {
    const myEvent: MyEvent = {
      title: event.title,
      start: event.start,
      description: event.extendedProps.description,
      creatorId: event.extendedProps.creatorId,
      _id: event.extendedProps._id,
    };
    console.log(`Event clicked: ${JSON.stringify(myEvent)}`);
    setCurrentClickedEvent(myEvent);
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
      if (!calendar_id) {
        throw new Error("Calendar id is not provided");
      }
      await deleteEventRemote(eventId, calendar_id);
      setEventList((prevEvents) => {
        return prevEvents.filter((event) => event._id !== eventId);
      });
    } catch {
      alert("Failed to delete event");
    }
  }

  async function updateEvent(event: MyEvent) {
    try {
      await updateEventRemote(event);
      setEventList((prevEvents) => {
        return prevEvents.map((prevEvent) => {
          if (prevEvent._id === event._id) {
            return event;
          }
          return prevEvent;
        });
      });
    } catch (e) {
      alert(`Failed to update event: ${e}`);
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
      const _id = crypto.randomBytes(12).toString("hex");
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
        updateEvent={updateEvent}
        onClose={() => setCurrentClickedEvent(null)}
        key={currentClickedEvent?._id}
      />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={eventList}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        defaultAllDay={false}
        defaultTimedEventDuration={{ hours: 0 }}
        forceEventDuration={true}
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
