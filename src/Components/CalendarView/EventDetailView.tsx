import React, { ReactElement, useState, useRef } from "react";
import MyEvent from "../../Types/Event";
import Popup from "reactjs-popup";

const formatDateForInputLocal = (date) => {
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
  shouldOpen: boolean;
  onClose: () => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  deleteEvent,
  updateEvent,
  shouldOpen,
  onClose,
}): ReactElement | null => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const startRef = useRef(null);

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
        description: descriptionRef.current.value || "",
        start: startRef.current.value,
      };
      updateEvent(updatedEvent);
      setEditMode(false);
      onClose();
    } catch (e) {
      alert(`Failed to update event: ${e}`);
    }
  }

  if (!event) {
    console.log(`Current event is null`);
    return null;
  }
  return (
    <Popup open={shouldOpen} closeOnDocumentClick onClose={onClose}>
      <div>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <p>{event.start.toLocaleDateString()}</p>
        <button onClick={handleEdit}> Edit </button>
        {editMode && (
          <div>
            <input type="text" defaultValue={event.title} ref={titleRef} />
            <input
              type="text"
              defaultValue={event.description}
              ref={descriptionRef}
            />
            <input
              type="datetime-local"
              defaultValue={formatDateForInputLocal(event.start)}
              ref={startRef}
            />
            <button onClick={handleSave}> Save </button>
          </div>
        )}
        <button
          onClick={() => {
            if (!event.extendedProps._id) {
              return;
            }
            deleteEvent(event.extendedProps._id);
            onClose();
          }}
        >
          Delete
        </button>
      </div>
    </Popup>
  );
};

export default EventDetailView;
