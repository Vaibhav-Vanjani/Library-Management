export default function SuccessVerified() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Animated Circle + Tick */}
      <div className="relative flex items-center justify-center">
        {/* Outer Circle */}
        <div className="animate-scaleIn bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
          {/* Tick Icon */}
          <svg
            className="text-green-600 w-12 h-12 animate-draw"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <p className="mt-4 text-green-700 text-xl font-semibold">
        Success Verified !!
      </p>
    </div>
  );
}
