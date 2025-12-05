import { useState } from "react";
import Loader from "./Loader";
import { useStudentContext } from "../context/StudentContext";
import { useNavigate } from "react-router-dom";

const ONE_MONTH_TUTION_FEE = 1200;
const ONE_MONTH_LOCKER_FEE = 400;

export default function () {
  console.log(
    process.env.REACT_APP_RAZORPAY_KEY_ID,
    "process.env.REACT_APP_RAZORPAY_KEY_ID",
  );
  const { loggedInUser } = useStudentContext();
  const redirect = useNavigate();
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    months: 1,
    locker: "true",
    Total_payment: 1600,
  });

  console.log("formData", formData);
  function paymentFormChangeHandler(event) {
    const { name, value } = event.target;
    console.log({ name, value }, "paymentFormChangeHandler");
    setFormData((prev) => {
      const newOption = { ...prev, [name]: value };
      newOption.Total_payment =
        newOption.months * ONE_MONTH_TUTION_FEE +
        (newOption.locker === "true"
          ? newOption.months * ONE_MONTH_LOCKER_FEE
          : 0);
      return newOption;
    });
  }

  async function paymentFormSubmitHandler(event) {
    event.preventDefault();
    console.log(formData, "Payment Form Data");

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_PAYMENT_GATEWAY_URL+ "/api/v1/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data, "payment data from backend");

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
          amount: formData.Total_payment * 100, // Amount is in currency subunits.
          currency: "INR",
          name: "BEST ACHIVERS",
          description: "Test Transaction",
          order_id: data.data.id, // This is the order_id created in the backend
          handler: async function (response) {
            const razorpay_payment_id = response.razorpay_payment_id;
            const razorpay_order_id = response.razorpay_order_id;
            const razorpay_signature = response.razorpay_signature;
            const order_id = data.data.id;
            const userId = loggedInUser.userId;
            const payment = String(formData.Total_payment);
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + formData.months);
            const expiresAt = currentDate.getTime().toString();

            const request = {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              order_id,
              userId,
              payment,
              expiresAt,
            };
            console.log("request", request);

            try {
              setLoading(true);
              const response = await fetch(
                process.env.REACT_APP_BACKEND_PAYMENT_GATEWAY_URL + "/api/v1/verify-payment",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(request),
                  credentials: "include",
                },
              );
              const data = await response.json();
              console.log("data", data);
              if (response.ok && data?.success) {
                setLoading(false);
                setOrderSummary((prev) => ({
                  ...prev,
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  order_id,
                  userId,
                  payment,
                  expiresAt,
                  success: true,
                }));
              } else {
                setLoading(false);
                setOrderSummary((prev) => ({
                  ...prev,
                  order_id,
                  payment,
                  success: false,
                }));
              }
            } catch (error) {
              console.log(error);
              setLoading(false);
              setOrderSummary((prev) => ({
                ...prev,
                order_id,
                payment,
                success: false,
              }));
            }
          },
          prefill: {
            name: loggedInUser.fullName,
            email: loggedInUser.email,
            contact: loggedInUser.phoneNumber,
          },
          theme: {
            color: "#F37254",
          },
          modal: {
            // ondismiss: handlePaymentCancel,
          },
        };

        console.log("options:", options);

        const razorpayInstance = new window.Razorpay(options);

        console.log(razorpayInstance);
        console.log("this is razorpay instance value");

        // You can handle payment failure by listening to the failure event.
        razorpayInstance.on("payment.failed", async (response) => {
          console.log(response.error.description);
        });

        razorpayInstance.open();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error, "Error from backend");
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <button
        onClick={() => redirect(-1)}
        className="absolute top-20 left-8 mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back
      </button>

      {orderSummary ? (
        <>
          {orderSummary.success ? (
            <section className="h-screen overflow-y-hidden flex justify-center items-center flex-col">
              <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-md shadow-md space-y-2 text-xl">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {orderSummary.order_id}
                </p>
                <p>
                  <span className="font-semibold">Payment ID:</span>{" "}
                  {orderSummary.razorpay_payment_id}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {orderSummary.payment}
                </p>
                <p>
                  <span className="font-semibold">Expires At:</span>{" "}
                  {new Date(Number(orderSummary.expiresAt)).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                </p>
              </div>
            </section>
          ) : (
            <section className="h-screen overflow-y-hidden flex justify-center items-center flex-col">
              <div className="bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-md shadow-md flex items-center justify-between">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {orderSummary.order_id}
                </p>
                <button
                  onClick={() => setOrderSummary(null)}
                  className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <section className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <form onSubmit={paymentFormSubmitHandler} className="space-y-6">
              {/* Months Selection */}
              <div>
                <label
                  htmlFor="months"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Duration (in Months):
                </label>
                <select
                  value={formData.months}
                  name="months"
                  id="months"
                  onChange={paymentFormChangeHandler}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="select">Select</option>
                  {new Array(36).fill(-1).map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Locker Selection */}
              <div>
                <span className="block text-gray-700 font-semibold mb-2">
                  Locker:
                </span>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="locker-yes"
                    className="flex items-center space-x-1"
                  >
                    <input
                      type="radio"
                      name="locker"
                      id="locker-yes"
                      value={true}
                      checked={formData.locker === "true"}
                      onChange={paymentFormChangeHandler}
                      className="form-radio text-blue-500"
                    />
                    <span>Yes</span>
                  </label>

                  <label
                    htmlFor="locker-no"
                    className="flex items-center space-x-1"
                  >
                    <input
                      type="radio"
                      name="locker"
                      id="locker-no"
                      value={false}
                      checked={formData.locker === "false"}
                      onChange={paymentFormChangeHandler}
                      className="form-radio text-blue-500"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Total Payment Display */}
              <div>
                <label
                  htmlFor="total_payment"
                  className="block text-gray-700 font-semibold text-xl"
                >
                  Total Payment:{" "}
                  <span className="text-blue-600">
                    {formData.Total_payment}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
