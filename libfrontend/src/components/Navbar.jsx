import { useStudentContext } from "../context/StudentContext";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";

export default function Navbar() {
  const { loggedInUser, setLoggedInUser } = useStudentContext();
  const redirect = useNavigate();
  async function logoutHandler() {
    try {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/common" + "/logout", {
        method: "POST",
        credentials: "include",
      });
      setLoggedInUser(null);
      
      if(document.documentElement.classList.contains('dark')){
        document.documentElement.classList.remove('dark');
      }
        
      redirect("/");
    } catch (error) {
      console.log(error, "Inside logoutHandler catch fn");
      alert("Something went wrong");
    }
  }

 return (
  <nav className="fixed w-screen top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-black/60 border-b border-white/20 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">

        {/* 🔷 Brand */}
        <div className="relative group cursor-pointer">
          <span className="text-2xl font-bold tracking-tight 
            bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 
            bg-clip-text text-transparent">
            Nexlib
          </span>

          {/* ✨ animated underline */}
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
        </div>

        {/* 🔹 Right Section */}
        <ul className="flex items-center space-x-5">
          {!loggedInUser?.userId ? (
            <></>
          ) : (
            <>
              {/* 🌗 Theme Switch */}
              <li className="transition-transform duration-200 hover:scale-110">
                <ThemeSwitch />
              </li>

              {/* 🚪 Logout Button */}
              <li>
                <button
                  onClick={logoutHandler}
                  className="relative px-5 py-1.5 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-red-500 via-red-500 to-red-400
                  hover:from-red-600 hover:to-red-500
                  shadow-md hover:shadow-xl
                  transition-all duration-300 ease-out
                  active:scale-95 overflow-hidden"
                >
                  Logout

                  {/* ✨ glow layer */}
                  <span className="absolute inset-0 rounded-lg bg-white/20 opacity-0 hover:opacity-100 transition duration-300"></span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  </nav>
);
}