import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLogInContext } from "../CustomHooks/useLogInContext";
import { logout, googleSignUpAndLogin } from "../Utilities/ConnectionHub";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

export default function Layout() {
  const { isLoggedIn, setLoggedIn } = useLogInContext();
  const navigate = useNavigate();
  async function handleLogOut() {
    try {
      await logout();
      googleLogout();
      setLoggedIn({ status: false, userId: "" });
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
            {isLoggedIn.status ? (
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
                <li>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const credential = credentialResponse.credential;
                        if (!credential) {
                          throw new Error("No credential in response");
                        }
                        const decoded = jwtDecode(credential);
                        console.log("Decoded JWT:", decoded);
                        const email = decoded.email;
                        if (!email) {
                          throw new Error("No email in JWT");
                        }
                        const response = await googleSignUpAndLogin(email);
                        setLoggedIn({
                          status: true,
                          userId: response.data.userId,
                        });
                        navigate("/calendarList");
                      } catch (e) {
                        console.error(`Failed with Google: ${e}`);
                      }
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                  ;
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
