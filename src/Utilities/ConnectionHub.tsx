import axios from "axios";
import Event from "../Types/Event";
import { padStart } from "@fullcalendar/core/internal.js";

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const signup = async (email: string, password: string) => {
  return await client.post("/signup", {
    email,
    password,
    requirePassword: true,
  });
};

export const googleSignup = async (email: string) => {
  return await client.post("/signup", {
    email,
    password: "",
    requirePassword: false,
  });
};

export const login = async (email: string, password: string) => {
  return await client.post("/login", {
    email,
    password,
    requirePassword: true,
  });
};

export const googleLogin = async (email: string) => {
  return await client.post("/login", {
    email,
    password: "",
    requirePassword: false,
  });
};

export const logout = async () => {
  return await client.get("/logout");
};

export const getCalendarList = async () => {
  return await client.get("/calendar/getAllCalendars");
};

export const addEmail = async (email: string) => {
  return await client.post("/user/addEmail", { email });
};

export const deleteEmail = async (email: string) => {
  return await client.post("/user/removeEmail", { email });
};

export const getEmails = async () => {
  return await client.get("/user/getEmails");
};

export const getEvents = async (calendarId: string) => {
  return await client.get(`/calendar/getEvents/${calendarId}`);
};

export const addEvent = async (event: Event, calendar_id: string) => {
  console.log(event);
  return await client.post("/calendar/addEvent", {
    _id: event._id,
    title: event.title,
    start: event.start,
    description: event.description,
    calendar_id,
  });
};

export const getLogInStatus = async () => {
  return await client.get("/logInStatus");
};

export const deleteEvent = async (eventId: string, calendar_id: string) => {
  return await client.post("/calendar/removeEvent", {
    eventId: eventId,
    calendarId: calendar_id,
  });
};

export const updateEvent = async (event: Event) => {
  return await client.post("/calendar/updateEvent", {
    eventId: event._id,
    title: event.title,
    start: event.start,
    description: event.description,
  });
};
