import { useEffect, useState } from "react";

export default function ({ userScan }) {
  const [showUser, setShowUser] = useState(userScan);

  useEffect(() => {
    if (!userScan?.length) return;

    // Update visible user list
    setShowUser(userScan);

    // Remove the toast after 2 seconds
    const timer = setTimeout(() => {
      setShowUser((prev) => {
        const newList = prev.slice(1); // safe copy
        return newList ?? [];
      });
    }, 2000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, [userScan]);

  return (
    <>
      {showUser?.length ? (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
                     animate-toastSlide bg-white shadow-xl rounded-lg 
                     px-5 py-3 flex items-center gap-3 text-green-700
                     font-semibold text-lg"
        >
          {/* Tick Icon */}
          <svg
            className="w-6 h-6 text-green-600 animate-draw"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Message */}
          {showUser[0].userId} JUST SCANNED
        </div>
      ) : null}
    </>
  );
}
