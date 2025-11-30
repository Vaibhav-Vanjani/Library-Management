import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const redirect = useNavigate();
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
          console.log("data",data);
          redirect('/student/verifiedScan');        
        }
        else{
           const data = await response.json();
           alert(data.message);
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
