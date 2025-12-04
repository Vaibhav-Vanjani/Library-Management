import { useStudentContext } from "../context/StudentContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { loggedInUser, setLoggedInUser } = useStudentContext();
  const redirect = useNavigate();
  async function logoutHandler() {
    try {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/common" + "/logout", {
        method: "GET",
        credentials: "include",
      });
      setLoggedInUser(null);
      redirect("/");
    } catch (error) {
      console.log(error, "Inside logoutHandler catch fn");
      alert("Something went wrong");
    }
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section - Logo / Brand */}
          <div className="flex-shrink-0 text-2xl font-bold">Best Achievers</div>

          {/* Right Section - Auth Buttons */}
          <ul className="flex space-x-4">
            {!loggedInUser?.userId ? (
              <></>
            ) : (
              <li>
                <button
                  className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
