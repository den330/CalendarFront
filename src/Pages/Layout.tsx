import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLogInContext } from "../CustomHooks/useLogInContext";

export default function Layout() {
  const { isLoggedIn, setLoggedIn } = useLogInContext();
  const navigate = useNavigate();
  function handleLogOut() {
    //TODO: implement network request to log out
    setLoggedIn(false);
    navigate("/login");
  }
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/calendarHome">Calendar Home</Link>
                </li>
                <li>
                  <button onClick={handleLogOut}>Log Out</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li>
                  <Link to="/login">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer> Calendar Share 2024 </footer>
    </div>
  );
}
