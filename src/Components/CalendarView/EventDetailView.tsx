import React, { ReactElement } from "react";
import MyEvent from "../../Types/Event";
import Popup from "reactjs-popup";

interface EventDetailViewProps {
  event: any;
  deleteEvent: (eventId: string) => Promise<void>;
  shouldOpen: boolean;
  onClose: () => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  deleteEvent,
  shouldOpen,
  onClose,
}): ReactElement | null => {
  if (!event) {
    return null;
  }
  return (
    <Popup open={shouldOpen} closeOnDocumentClick onClose={onClose}>
      <div>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <p>{event.start.toString()}</p>
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
