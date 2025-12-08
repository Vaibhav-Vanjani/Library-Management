import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function StylishForm() {
  const redirect = useNavigate();
  const [enrollFormData, setEnrollFormData] = useState({});
  const [loading, setLoading] = useState(false);

  async function enrollFormchangeHandler(event) {
    let { name, value, type } = event.target;
    if(type === 'file'){
      try {
          const fileData = new FormData();
          fileData.append('file',event.target.files[0]);
          
          const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/admin' + '/uploadPic',{
            method:"POST",
            body:fileData,
            credentials:"include"
          });
          const data = await response.json();
          
          if(response.ok){
            alert("Profile Upload Success");
            value = data.url;
          }
          else{
            alert("Profile Upload Failure");
            return;
          }
      } catch (error) {
        console.log(error,"something went wrong in uploading file");
      }
    }
    setEnrollFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function enrollFormSubmitHandler(event) {
    event.preventDefault();
    enrollFormData["enrolledAt"] = new Date(
      enrollFormData["enrolledAt"],
    ).getTime();
    enrollFormData["expiresAt"] = new Date(
      enrollFormData["expiresAt"],
    ).getTime();
    console.log(enrollFormData, "enrollFormData");

    try {
      setLoading(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/admin" + "/enrollStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(enrollFormData),
      });
      console.log(response, "response");
      if (response.ok) {
        const data = await response.json();
        console.log(data, "data");
        alert("Successfully Enrolled !!");
      }else{
        setLoading(false);
        alert("Please search if user is valid");
      }
    } catch (error) {
      console.log(error, "inside enrollFormSubmitHandler");
      alert("Something Went Wrong While Enrollment !!");
    }
    setLoading(false);
    setEnrollFormData({});
    enrollFormData["profilePic"] = "";
  }

  return (
    <>
      {loading ? <Loader /> : <></>}
      <button
        onClick={() => redirect(-1)}
        className="absolute top-20 left-8 mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back
      </button>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          className="mt-6 bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4"
          onSubmit={enrollFormSubmitHandler}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Registration Form
          </h2>

       <div className="flex justify-center">
        <div className="relative rounded-full w-40 h-40 border flex items-center justify-center">
          <div className="flex flex-col flex-wrap items-center">
            <svg class="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"/></svg>
            <span>Upload Pic</span>
          </div>
          <input
            type="file"
            name="profilePic"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            onChange={enrollFormchangeHandler}
          />
        </div>
      </div>


          <input
            type="text"
            name="aadharCardNumber"
            placeholder="Aadhar Card Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["aadharCardNumber"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <input
            type="text"
            name="userId"
            placeholder="Identification Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["userId"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <input
            type="text"
            name="fullName"
            placeholder="Enter Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["fullName"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["email"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <input
            type="number"
            name="payment"
            placeholder="Payment"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["payment"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <input
            type="date"
            name="enrolledAt"
            placeholder="Enrollment Date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["enrolledAt"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <input
            type="date"
            name="expiresAt"
            placeholder="Expiry Date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["expiresAt"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={enrollFormData["phoneNumber"] ?? ""}
            onChange={enrollFormchangeHandler}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
