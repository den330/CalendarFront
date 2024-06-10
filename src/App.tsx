import { Routes, Route, Navigate } from "react-router-dom";
import { useLogInContext } from "./CustomHooks/useLogInContext";
import CalendarMainView from "./Pages/CalendarMainView";
import CalendarList from "./Pages/CalendarList";
import { useEffect, useState } from "react";
import { getLogInStatus } from "./Utilities/ConnectionHub";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Layout from "./Pages/Layout";
import About from "./Pages/About";

function App() {
  const { isLoggedIn, setLoggedIn } = useLogInContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    async function fetchLogInStatus() {
      try {
        const response = await getLogInStatus();
        const loginStatus = response.data.logInStatus;
        if (loginStatus) {
          setLoggedIn({ status: true, userId: response.data.userId });
        } else {
          setLoggedIn({ status: false, userId: "" });
        }
      } catch (e) {
        setLoggedIn({ status: false, userId: "" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogInStatus();
  }, []);
  if (isLoading) {
    return <h1>Loading</h1>;
  }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Navigate
              replace
              to={isLoggedIn.status ? "/calendarList" : "/login"}
            />
          }
        />
        {isLoggedIn.status && (
          <Route path="/calendarList" element={<CalendarList />} />
        )}
        {isLoggedIn.status && (
          <Route
            path="/calendar/:calendar_id/:owner/:ownerShip"
            element={<CalendarMainView />}
          />
        )}
        {!isLoggedIn.status && <Route path="/signup" element={<Signup />} />}
        {!isLoggedIn.status && <Route path="/login" element={<Login />} />}
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
