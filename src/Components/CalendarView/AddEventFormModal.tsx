import { useRef } from "react";

export default function AddEventFormModal({
  addEvent,
  shouldAppear,
}: {
  addEvent: (name: string, date: Date, description?: string) => Promise<void>;
  shouldAppear: boolean;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault;
    const name = nameRef.current?.value;
    const dateString = dateRef.current?.value;
    const description = descriptionRef.current?.value;
    if (!name || !dateString) {
      alert("Date and Name are required.");
      return;
    }
    const date = new Date(dateString);
    addEvent(name, date, description);
  }
  if (!shouldAppear) {
    return null;
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" ref={nameRef} />
      <label htmlFor="date">Date</label>
      <input id="date" name="date" type="datetime-local" ref={dateRef} />
      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        type="text"
        ref={descriptionRef}
      />
      <button type="submit">Add Event</button>
    </form>
  );
}
