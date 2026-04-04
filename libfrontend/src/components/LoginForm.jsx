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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">

      {/* 🔵 Animated background blobs */}
      <div className="absolute w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse bottom-10 right-10"></div>

      {/* 🧊 Glass Card */}
      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl p-8 border border-white/40 transition-all duration-300 hover:shadow-2xl">

        {/* ✨ Heading */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 tracking-tight">
          Welcome Back 👋
        </h2>

        <form onSubmit={loginFormSubmitHandler} className="space-y-5">

          {/* 📧 Email */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-600 font-medium">
              Email
            </label>
            <input
              type="email"
              required
              onChange={loginFormChangeHandler}
              placeholder="Enter your email"
              name="email"
              value={loginFormData["email"] ?? ""}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-blue-500 transition-all duration-200
              bg-white/80 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* 🆔 User ID */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-600 font-medium">
              User ID
            </label>
            <input
              type="text"
              required
              onChange={loginFormChangeHandler}
              placeholder="Enter your user ID"
              name="userId"
              value={loginFormData["userId"] ?? ""}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-blue-500 transition-all duration-200
              bg-white/80 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* 🚀 Button */}
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 
            hover:from-blue-700 hover:to-blue-600 
            text-white font-semibold py-2.5 rounded-lg 
            shadow-md hover:shadow-lg 
            transform hover:-translate-y-0.5 
            transition-all duration-200"
          >
            Login
          </button>
        </form>

        {/* 🔽 Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secure login • Smooth experience
        </p>
      </div>
    </div>
  </>
)
}