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
    {/* <BestAchiverFeatureButton/> */}
      <div className="absolute top-1/3 w-11/12 sm:absolute top-1/3 left-1/2 -translate-x-1/2">
        <form
          onSubmit={loginFormSubmitHandler}
          className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          {/* Email */}
          <input
            type="email"
            required
            onChange={loginFormChangeHandler}
            placeholder="Enter Email"
            name="email"
            value={loginFormData["email"] ?? ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        text-gray-800"
          />

          {/* User ID */}
          <input
            type="text"
            required
            onChange={loginFormChangeHandler}
            placeholder="Enter User ID"
            name="userId"
            value={loginFormData["userId"] ?? ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        text-gray-800"
          />

          {/* Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 
                        text-white font-semibold py-2 rounded-md 
                        transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
