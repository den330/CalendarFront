import React, { ReactElement, useState, useRef } from "react";
import MyEvent from "../../Types/Event";
import Popup from "reactjs-popup";
import { useLogInContext } from "../../CustomHooks/useLogInContext";

const formatDateForInputLocal = (date: Date) => {
  // Adjust for the timezone offset to keep it local
  const localISOTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  return localISOTime.slice(0, 16);
};

interface EventDetailViewProps {
  event: MyEvent;
  deleteEvent: (eventId: string) => Promise<void>;
  updateEvent: (event: MyEvent) => Promise<void>;
  calendarOwnership: boolean;
  shouldOpen: boolean;
  onClose: () => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  deleteEvent,
  updateEvent,
  calendarOwnership,
  shouldOpen,
  onClose,
}): ReactElement | null => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const { isLoggedIn } = useLogInContext();

  function handleEdit() {
    setEditMode(!editMode);
  }

  async function handleSave() {
    try {
      if (!titleRef.current || !startRef.current) {
        return;
      }
      const updatedEvent: MyEvent = {
        ...event,
        title: titleRef.current.value,
        description: descriptionRef.current ? descriptionRef.current.value : "",
        start: new Date(startRef.current.value),
      };
      updateEvent(updatedEvent);
      setEditMode(false);
      onClose();
    } catch (e) {
      alert(`Failed to update event: ${e}`);
    }
  }

  if (!event) {
    return null;
  }
  return (
    <Popup
      open={shouldOpen}
      closeOnDocumentClick
      onClose={onClose}
      modal
      nested
    >
      <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800">
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
        <p>{event.description}</p>
        <p>{event.start.toLocaleDateString()}</p>
        {(isLoggedIn.userId === event.creatorId || calendarOwnership) && (
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
          >
            Edit
          </button>
        )}
        {editMode && (
          <div className="space-y-4 mt-4">
            <input
              type="text"
              defaultValue={event.title}
              ref={titleRef}
              className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              defaultValue={event.description}
              ref={descriptionRef}
              className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="datetime-local"
              defaultValue={formatDateForInputLocal(event.start)}
              ref={startRef}
              className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-150 ease-in-out"
            >
              Save
            </button>
          </div>
        )}
        {(isLoggedIn.userId === event.creatorId || calendarOwnership) && (
          <button
            onClick={() => {
              if (!event._id) {
                return;
              }
              deleteEvent(event._id);
              onClose();
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-150 ease-in-out"
          >
            Delete
          </button>
        )}
      </div>
    </Popup>
  );
};

export default EventDetailView;
