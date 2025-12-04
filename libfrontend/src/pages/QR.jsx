import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const redirect = useNavigate();
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false,
    );

    scanner.render(async (decodedText) => {
      const { scannerId } = JSON.parse(decodedText);

      if (!scannerId) {
        return alert("Invalid Scan !!");
      }

      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/user" + "/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            scannerId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          redirect("/student/verifiedScan");
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.log("inside A1scanner", error);
      }
    });

    return () => scanner.clear();
  }, []);

  return (
    <>
      <button
        onClick={() => redirect(-1)}
        className="absolute top-20 left-8 mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back
      </button>
      <div className="flex flex-col items-center justify-center mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Scan QR</h2>

        <div
          id="qr-reader"
          className="w-64 h-64 rounded-lg shadow-lg border border-gray-300 
                 bg-white flex flex-col flex-wrap items-end justify-center"
        ></div>
      </div>
    </>
  );
}
