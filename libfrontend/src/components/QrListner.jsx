import { useEffect, useState } from "react";

export default function QrAdminListener() {
  const [scannedBy, setScannedBy] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:3001/api/check-scan/");
        const data = await res.json();

        if (data.scannedBy) {
          setScannedBy(data.scannedBy);
        }
      } catch (error) {
        console.log(error,"inside qr listner"); 
      }
    }, 5000); // poll every 5 second  

    return ()=>clearInterval(interval);
  }, []);

  if (!scannedBy) {
    return <p>Waiting for A1 to scan...</p>;
  }

  return (
    <div>
      <h2>A1 Scanned!</h2>
      <pre>{JSON.stringify(scannedBy, null, 2)}</pre>
    </div>
  );
}
