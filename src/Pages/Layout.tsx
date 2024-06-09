import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLogInContext } from "../CustomHooks/useLogInContext";
import { logout } from "../Utilities/ConnectionHub";

export default function Layout() {
  const { isLoggedIn, setLoggedIn } = useLogInContext();
  const navigate = useNavigate();
  async function handleLogOut() {
    try {
      await logout();
      setLoggedIn(false);
      navigate("/login");
    } catch (e) {
      alert(`Failed to log out: ${e}`);
    }
  }
  return (
    <div>
      <header>
        <nav className="bg-white">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogOut}>Log Out</button>
              </li>
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
