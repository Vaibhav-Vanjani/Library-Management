import { useEffect, useState } from "react";
import BackButton from "./BackButton";

export default function () {
  const [entryExitRows, setEntryExitRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeStudent = entryExitRows.filter((row) => {
    return row.isPresent;
  });
  useEffect(() => {
    async function getAllEntryExitColumn() {
      try {
        const res = await fetch(process.env.REACT_APP_BACKEND_URL + "/admin" + "/api/entryExitView/",{
          method:"GET",
          headers:{"Content-Type":"application/json"},
          credentials:"include",
        });
        const data = await res.json();

        if (data.data) {
          setEntryExitRows(data.data);
        }
      } catch (error) {
        console.log(error, "inside qr listner");
      }
      setLoading(false);
    }
    getAllEntryExitColumn();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <BackButton />
      <div className="flex flex-col justify-center items-center mt-6">
        {/* Title */}
        <div className="mt-12 bg-gray-700 text-white px-6 py-3 rounded-md text-2xl font-semibold shadow mb-6">
          Student Currently Present: {activeStudent?.length}
        </div>

        {/* Container */}
        <div className="w-full max-w-3xl">
          {/* Header */}
          <section className="flex font-semibold border-b-2 pb-3 mb-3 text-xl text-gray-800">
            <div className="w-1/3 text-left">USER ID</div>
            <div className="w-1/3 text-left">ENTRY TIME</div>
            <div className="w-1/3 text-left">EXIT TIME</div>
          </section>

          {/* Rows */}
          {entryExitRows?.length > 0 &&
            entryExitRows.map((row) => {
              const entry = new Date(Number(row.entryTime));
              const exit = new Date(Number(row.exitTime));

              return (
                <section
                  key={row.userId + row.entryTime}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg shadow 
                 text-lg transition-colors 
                 ${row.isPresent ? "bg-green-200 border-l-4 border-green-600" : "bg-red-200 border-l-4 border-red-600"}`}
                >
                  <div className="w-1/3 text-left font-medium">
                    {row.userId}
                  </div>
                  <div className="w-1/3 text-left">
                    {entry.getHours()}:
                    {entry.getMinutes().toString().padStart(2, "0")}
                  </div>
                  <div className="w-1/3 text-left">
                  {!row.isPresent ? (exit.getHours() + ":" +
                    exit.getMinutes().toString().padStart(2, "0")) : ""}
                  </div>
                </section>
              );
            })}
        </div>
      </div>
    </>
  );
}
