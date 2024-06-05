import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLogInContext } from "./CustomHooks/useLogInContext";

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
        {!isLoggedIn && <Route path="/signup" element={<Signup />} />}
        {!isLoggedIn && <Route path="/login" element={<Login />} />}
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
