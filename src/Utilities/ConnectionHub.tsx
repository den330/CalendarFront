import axios from "axios";
import { Event } from "../Types/Event";

const client = axios.create({
  baseURL: import.meta.env.base_url,
  withCredentials: true,
});

export const signup = async (email: string, password: string) => {
  return await client.post("/signup", { email, password });
};

export const login = async (email: string, password: string) => {
  return await client.post("/login", { email, password });
};

export const getCalendarList = async () => {
  return await client.get("/calendar/getAllCalendars");
};

export const addEmail = async (email: string) => {
  return await client.post("/user/addEmail", { email });
};

export const getEvents = async (calendarId: string) => {
  return await client.get(`/calendar/getEvents/${calendarId}`);
};

export const addEvent = async (event: Event, calendar_id: String) => {
  return await client.post("/addEvent", {
    name: event.name,
    start: event.start,
    description: event.description,
    calendar_id,
  });
};

export const deleteEvent = async (event: Event, calendar_id: String) => {
  return await client.post("/removeEvent", {
    eventId: event.__id,
    calendarId: calendar_id,
  });
};

export const updateEvent = async (event: Event) => {
  return await client.post("/updateEvent", {
    eventId: event.__id,
    name: event.name,
    start: event.start,
    description: event.description,
  });
};