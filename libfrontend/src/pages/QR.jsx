import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function ({ currentUser = "1245" }) {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(async (decodedText) => {
      const { scannerId } = JSON.parse(decodedText);

      try {
        await fetch("http://localhost:3001/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
            scannerId,
            scannedBy: currentUser
        })
      });
        alert("Scan sent to server!");
      } catch (error) {
        console.log("inside A1scanner",error);
      }
    });

    return () => scanner.clear();
  }, []);

  return (
    <><div>
          <h2>Scan A2’s QR</h2>
          <div
              id="qr-reader"
              className="w-64 h-64 border rounded-lg shadow-lg"
          ></div>
      </div>
      <hr />
      </>
  );
}
