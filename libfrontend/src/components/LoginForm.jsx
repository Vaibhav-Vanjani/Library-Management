import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../context/StudentContext";
import Loader from "./Loader";
import BestAchiverFeatureButton from "./BestAchiverFeatureButton";

export default function () {
  const redirect = useNavigate();
  const [loginFormData, setLoginFormData] = useState({});
  const { loggedInUser, setLoggedInUser } = useStudentContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function isLoggedIn() {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/common" + "/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginFormData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          if (data.success) {
            if (data?.data?.isAdmin) {
              setLoggedInUser(data.data);
              redirect("/admin");
            } else {
              setLoggedInUser(data.data);
              redirect("/student");
            }
          } else {
            console.log("data alert", data);
            alert(data.message);
          }
        }
      } catch (error) {
        console.log(error, "Inside loginFormSubmitHandler");
      }
    }
    isLoggedIn();
  }, []);

  function loginFormChangeHandler(event) {
    const { name, value } = event.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function loginFormSubmitHandler(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/common" + "/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        if (data.success) {
          if (data?.data?.isAdmin) {
            setLoggedInUser(data.data);
            setLoading(false);
            redirect("/admin");
          } else {
            setLoggedInUser(data.data);
            setLoading(false);
            redirect("/student");
          }
        } else {
          console.log("data alert", data);
          setLoading(false);
          alert(data.message);
        }
      } else {
        console.log(response);
        setLoading(false);
        alert("Invalid Crendentials");
      }
    } catch (error) {
      setLoading(false);
      console.log(error, "Inside loginFormSubmitHandler");
      alert("Contact Admin - Something Went Wrong !!");
    }
  }

  if (loading) {
    return <Loader />;
  }

return (
  <>
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden px-4 py-10">

  {/* 🔵 Background Glow */}
  <div className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse top-0 left-0"></div>
  <div className="absolute w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30 animate-pulse bottom-0 right-0"></div>

  {/* 🌟 Main Layout */}
  <div
    className="
      relative z-10 flex items-center
      w-full max-w-7xl
       flex-col lg:flex-row
      items-center justify-center
      gap-5 lg:gap-8
    "
  >
    <div
      className="
        w-fit my-10 lg:h-fit
        bg-white/85
        backdrop-blur-2xl
        rounded-3xl
        p-5
        shadow-xl
        border border-cyan-100
        relative overflow-hidden
      "
    >

      {/* Glow */}
      <div className="absolute top-0 right-0 bg-cyan-300/20 blur-2xl rounded-full"></div>

      <div className="relative z-10 h-full flex flex-col">

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-500 font-semibold">
            Test Credentials
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-1">
            🎓 Student Login
          </h3>
        </div>

        <button
          onClick={() =>
            setLoginFormData({
              userId: "1247",
              email: "test2@g.com",
            })
          }
          className="
            mt-5 w-full
            bg-cyan-500 hover:bg-cyan-600
            text-white font-semibold text-sm
            py-3 rounded-2xl
            shadow-md hover:shadow-lg
            transition-all duration-300
            hover:-translate-y-0.5
          "
        >
          Auto Fill Credentials
        </button>
      </div>
    </div>

    <div
      className="
        w-full max-w-md
        backdrop-blur-xl
        bg-white/75
        shadow-2xl
        rounded-3xl
        p-6 sm:p-8
        border border-white/40
        transition-all duration-300
        hover:shadow-blue-200/50
      "
    >

      {/* Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Login to continue your journey
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={loginFormSubmitHandler}
        className="space-y-5"
      >

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Email
          </label>

          <input
            type="email"
            required
            onChange={loginFormChangeHandler}
            placeholder="Enter your email"
            name="email"
            value={loginFormData["email"] ?? ""}
            className="
              w-full px-4 py-3 rounded-xl
              border border-gray-300
              bg-white/80
              text-gray-800
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
              focus:border-blue-500
              transition-all duration-200
            "
          />
        </div>

        {/* User ID */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            User ID
          </label>

          <input
            type="text"
            required
            onChange={loginFormChangeHandler}
            placeholder="Enter your user ID"
            name="userId"
            value={loginFormData["userId"] ?? ""}
            className="
              w-full px-4 py-3 rounded-xl
              border border-gray-300
              bg-white/80
              text-gray-800
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
              focus:border-blue-500
              transition-all duration-200
            "
          />
        </div>

        {/* Login Button */}
        <button
          className="
            w-full
            bg-gradient-to-r from-blue-600 to-blue-500
            hover:from-blue-700 hover:to-blue-600
            text-white font-semibold
            py-3 rounded-xl
            shadow-lg hover:shadow-xl
            transition-all duration-300
            hover:-translate-y-0.5
          "
        >
          Login
        </button>
      </form>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center mt-6">
        Secure login • Smooth UI • Responsive design
      </p>
    </div>

    {/* ================= ADMIN FLOW ================= */}
    <div
      className="
        w-fit my-10 lg: h-fit
        bg-white/85
        backdrop-blur-2xl
        rounded-3xl
        p-5
        shadow-xl
        border border-pink-100
        relative overflow-hidden
      "
    >

      {/* Glow */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/20 blur-2xl rounded-full"></div>

      <div className="relative z-10 h-full flex flex-col">

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-pink-500 font-semibold">
            Test Credentials
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-1">
            🛡 Admin Login
          </h3>
        </div>

        <button
          onClick={() =>
            setLoginFormData({
              userId: "0000",
              email: "admin@g.com",
            })
          }
          className="
            mt-5 w-full
            bg-pink-500 hover:bg-pink-600
            text-white font-semibold text-sm
            py-3 rounded-2xl
            shadow-md hover:shadow-lg
            transition-all duration-300
            hover:-translate-y-0.5
          "
        >
          Auto Fill Credentials
        </button>
      </div>
    </div>

  </div>
</div>
</>
)
}