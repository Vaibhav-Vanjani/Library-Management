import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function StylishForm() {
   const redirect = useNavigate();
   const [enrollFormData,setEnrollFormData] = useState({});
   const [loading,setLoading] = useState(false);

   function enrollFormchangeHandler(event){
    let {name,value,type} = event.target;
    setEnrollFormData(prev=>{
      return {...prev,[name]:value}
    });
   }

   async function enrollFormSubmitHandler(event){
      event.preventDefault();
      enrollFormData["enrolledAt"] = (new Date(enrollFormData["enrolledAt"])).getTime();
      enrollFormData["expiresAt"] = (new Date(enrollFormData["expiresAt"])).getTime();
      console.log(enrollFormData,"enrollFormData");

      try {
          setLoading(true);
          const response = await fetch('http://localhost:3001/enrollStudent',{
                              method:"POST",
                              headers:{
                                "Content-Type":"application/json",
                              },
                              body:JSON.stringify(enrollFormData)
                            });
         console.log(response,"response");
         if(response.ok){
            const data = await response.json();
            console.log(data,"data");
            alert("Successfully Enrolled !!");
         }
      } catch (error) {
        console.log(error,"inside enrollFormSubmitHandler"); 
        alert("Something Went Wrong While Enrollment !!");
      }
      setLoading(false);
      setEnrollFormData({});
   }


  return (
    <>  
      {loading ? <Loader/> : <></>}
      <button
        onClick={() => redirect(-1)}
        className="absolute top-20 left-8 mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back
      </button>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      

      <form 
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4"
        onSubmit={enrollFormSubmitHandler}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Registration Form
        </h2>

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
