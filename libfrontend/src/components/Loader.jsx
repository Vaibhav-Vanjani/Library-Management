export default function Loader() {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div className="text-white text-xl font-medium">Loading...</div>
      </div>
    </div>
  );
}
