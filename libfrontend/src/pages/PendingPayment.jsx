import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useStudentContext } from "../context/StudentContext";

export default function PendingDefaulters() {
  const redirect = useNavigate();
  const {pendingDefaulter} = useStudentContext();

//   const pendingDefaulter = [
//     {
//       fullName: "test 1",
//       userId: "837287382",
//       enrolledAt: "1758751325000",
//       Payment: "1200",
//       expiresAt: "1766613725000",
//       email: "test@gmail.com",
//     },
//     {
//       fullName: "test2",
//       userId: "39289392",
//       enrolledAt: "1758751325000",
//       Payment: "1200",
//       expiresAt: "1766613725000",
//       email: "test2@gmail.com",
//     },
//   ];

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => redirect(-1)}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back
      </button>

      {/* Defaulters List */}
      <div className="grid gap-6">
        {pendingDefaulter.map((defaulter, index) => {
          const enrolledDate = new Date(Number(defaulter.enrolledAt));
          const expiryDate = new Date(Number(defaulter.expiresAt));

          return (
            <section
              key={index}
              className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg p-4 space-y-4 md:space-y-0 md:space-x-6"
            >
              {/* Profile Pic Placeholder */}
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold">
                {defaulter?.fullName?.charAt(0)?.toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex flex-col space-y-1 text-gray-700">
                <div>
                  <span className="font-semibold">Full Name: </span>
                  {defaulter.fullName}
                </div>
                <div>
                  <span className="font-semibold">User ID: </span>
                  {defaulter.userId}
                </div>
                <div>
                  <span className="font-semibold">Email: </span>
                  {defaulter.email}
                </div>
                <div>
                  <span className="font-semibold">Phone Number: </span>
                  {defaulter.phoneNumber}
                </div>
                <div>
                  <span className="font-semibold">Enrolled At: </span>
                  {enrolledDate.toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Expiry At: </span>
                  {expiryDate.toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Payment: </span>{defaulter.payment}
                </div>
              </div>

              {/* Notification Buttons */}
              <button onClick={()=>console.log("Email Sent Successfully")}>Send Email</button>
            </section>
          );
        })}
      </div>
    </div>
    </>
  );
}
