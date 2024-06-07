import { Routes, Route, Navigate } from "react-router-dom";
import { useLogInContext } from "./CustomHooks/useLogInContext";
import CalendarMainView from "./Pages/CalendarMainView";
import CalendarList from "./Pages/CalendarList";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Layout from "./Pages/Layout";
import About from "./Pages/About";

function App() {
  const { isLoggedIn } = useLogInContext();
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Navigate replace to={isLoggedIn ? "/calendarList" : "/login"} />
          }
        />
        {isLoggedIn && (
          <Route path="/calendarList" element={<CalendarList />} />
        )}
        {isLoggedIn && (
          <Route
            path="/calendar/:calendar_id/:owner/:ownerShip"
            element={<CalendarMainView />}
          />
        )}
        {!isLoggedIn && <Route path="/signup" element={<Signup />} />}
        {!isLoggedIn && <Route path="/login" element={<Login />} />}
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
