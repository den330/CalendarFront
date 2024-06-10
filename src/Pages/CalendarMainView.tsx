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
import { EventClickArg } from "@fullcalendar/core/index.js";

export default function CalendarMainView() {
  const { calendar_id, owner, ownerShip } = useParams();
  const [eventList, setEventList] = useState<MyEvent[]>([]);
  const [addEventModal, setAddEventModal] = useState<boolean>(false);
  const [currentClickedEvent, setCurrentClickedEvent] =
    useState<MyEvent | null>(null);

  function handleEventClick({ event }: EventClickArg) {
    const startDate = event.start;
    if (!startDate) {
      return;
    }
    const myEvent: MyEvent = {
      title: event.title,
      start: startDate,
      description: event.extendedProps.description,
      creatorId: event.extendedProps.creatorId,
      _id: event.extendedProps._id,
    };
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
      setEventList((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch {
      alert("Failed to delete event");
    }
  }

  async function updateEvent(event: MyEvent) {
    try {
      await updateEventRemote(event);
      setEventList((prevEvents) =>
        prevEvents.map((prevEvent) =>
          prevEvent._id === event._id ? event : prevEvent
        )
      );
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
      await addEvent(newEvent, calendar_id);
      setEventList((prevEvents) => [...prevEvents, newEvent]);
      setAddEventModal(false);
    } catch (error) {
      alert("Failed to add event" + error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">{owner}</h1>
      <button
        onClick={handleAddEvent}
        className="mb-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
      >
        Add MyEvent
      </button>
      <AddEventFormModal
        addEvent={addEventInCalendar}
        shouldAppear={addEventModal}
      />
      <EventDetailView
        shouldOpen={currentClickedEvent !== null}
        event={currentClickedEvent!}
        deleteEvent={deleteEvent}
        updateEvent={updateEvent}
        calendarOwnership={ownerShip === "true"}
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
