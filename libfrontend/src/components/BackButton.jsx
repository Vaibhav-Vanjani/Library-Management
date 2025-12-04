import { useNavigate } from "react-router-dom";

export default function () {
  const redirect = useNavigate();
  return (
    <button
      onClick={() => redirect(-1)}
      className="absolute top-20 left-8 mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Back
    </button>
  );
}
