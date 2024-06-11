import { useEffect, useState, useRef } from "react";
import {
  getCalendarList,
  addEmail,
  deleteEmail,
  getEmails,
} from "../Utilities/ConnectionHub";
import { useNavigate } from "react-router-dom";
import Calendar from "../Types/Calendar";
import Select from "react-dropdown-select";

export default function CalendarList() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const [calendarList, setCalendarList] = useState<Calendar[] | []>([]);
  const [myCalendar, setMyCalendar] = useState<Calendar | null>(null);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);

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
        const response = await getEmails();
        setEmailList(response.data.emails ?? []);
      } catch (e) {
        alert(`Failed to fetch email list: ${e}`);
      }
    }

    fetchEmailList();
    fetchCalendarList();
  }, []);

  async function handleDeleteEmail() {
    if (!emailToDelete) {
      alert("Email is required");
      return;
    }
    try {
      await deleteEmail(emailToDelete);
      alert("Email deleted successfully");
      setEmailList((prev) => prev.filter((email) => email !== emailToDelete));
      setEmailToDelete(null);
    } catch (e) {
      alert(`Failed to delete email: ${e}`);
    }
  }

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
      alert("New email added successfully");
      emailRef.current!.value = "";
    } catch (e) {
      alert(`Failed to add email: ${e}`);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Calendar List</h1>
      <div className="space-y-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
          onClick={() => {
            const url = `/calendar/${myCalendar?._id}/${myCalendar?.name}/true`;
            navigate(url);
          }}
        >
          My Calendar
        </button>
        <div>
          <label className="block text-sm font-medium text-gray-700 w-52">
            Add the email addresses of users you wish to share your calendar
            with:
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="email"
              ref={emailRef}
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleAddEmail}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Confirm
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delete Email:
          </label>
          <div className="mt-1 flex rounded-md shadow-sm w-52">
            <Select
              values={
                emailToDelete
                  ? [{ value: emailToDelete, label: emailToDelete }]
                  : []
              }
              options={emailList.map((email) => ({
                value: email,
                label: email,
              }))}
              onChange={(selected) => {
                setEmailToDelete(selected[0].value);
              }}
              className="flex-grow"
            />
            <button
              onClick={handleDeleteEmail}
              className="px-4 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Shared Calendars</h2>
        {calendarList.length === 0 && (
          <p>No shared calendars available at the moment.</p>
        )}
        {calendarList.map((calendar) => (
          <button
            key={calendar._id}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
            onClick={() => {
              const url = `/calendar/${calendar._id}/${calendar.name}/false`;
              navigate(url);
            }}
          >
            {calendar.name}
          </button>
        ))}
      </div>
    </div>
  );
}
