import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { redirect } from "react-router-dom";

export default function () {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(async (decodedText) => {
      const { scannerId } = JSON.parse(decodedText);

      if(!scannerId){
        return alert("Invalid Scan !!");
      }

      try {
        const response = await fetch("http://localhost:3001/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
            scannerId
          })
        });

        if(response.ok){
          const data = await response.json();
          if(data.success){
            redirect('/student/verifiedScan');        
          }
          else{
             alert("FAILURE SCAN");
          }
        }
        
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
