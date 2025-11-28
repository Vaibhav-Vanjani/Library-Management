import { QRCodeSVG } from "qrcode.react";

export default function ({ userId }) {
  const qrValue = JSON.stringify({ scannerId: userId });

  return (
    <div>
      <h2>Ask A1 to Scan This</h2>
      <QRCodeSVG value={qrValue} size={200} />
    </div>
  );
}
