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
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-between items-center py-4">
            <li>
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-blue-600 hover:text-blue-800">
                About
              </Link>
            </li>
            {isLoggedIn.status ? (
              <li>
                <button
                  onClick={handleLogOut}
                  className="text-red-600 hover:text-red-800"
                >
                  Log Out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const credential = credentialResponse.credential;
                        if (!credential) {
                          throw new Error("No credential in response");
                        }
                        const decoded: { email: string } =
                          jwtDecode(credential);
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
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        Calendar Share 2024
      </footer>
    </div>
  );
}
