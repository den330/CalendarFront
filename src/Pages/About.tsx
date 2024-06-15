import { getAboutMessage } from "../Utilities/ConnectionHub";
import io from "socket.io-client";
import { useState, useEffect } from "react";

export default function About() {
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    async function fetchAboutMessage() {
      try {
        const response = await getAboutMessage();
        setMessage(response.data.message);
      } catch (e) {
        alert(`Failed to fetch about message: ${e}`);
      }
    }
    fetchAboutMessage();
    const socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
    });
    console.log(`socket is ${socket}`);
    socket.on("messageUpdated", (data: { message: string }) => {
      setMessage(data.message);
    });
    return () => {
      socket.off("messageUpdated");
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: message }}></p>
    </div>
  );
}
