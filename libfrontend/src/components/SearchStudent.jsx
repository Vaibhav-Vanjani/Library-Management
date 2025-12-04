import { useState } from "react";
import BackButton from "./BackButton";
import Loader from "./Loader";

const studentSearchFilters = [
  { filter_value: "fullName", filter_name: "Name" },
  { filter_value: "phoneNumber", filter_name: "Phone Number" },
  { filter_value: "userId", filter_name: "User ID" },
  { filter_value: "email", filter_name: "Email" },
];

export default function () {
  const [searchedStudentData, setSearchStudentData] = useState([]);
  const [studentSearchForm, setStudentSearchForm] = useState({});
  const [loading, setLoading] = useState(false);

  console.log(searchedStudentData, "searchedStudentData");

  function searchStudentChangeHandler(event) {
    const { name, value } = event.target;
    console.log({ name, value }, "{name,value}");
    setStudentSearchForm((prev) => ({ ...prev, [name]: value }));
  }

  async function searchStudentSubmitHandler() {
    if (!studentSearchForm?.searchFor || !studentSearchForm?.searchOption) {
      return alert("Please complete details");
    }

    console.log(studentSearchForm, "studentSearchForm");

    try {
      setLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/admin" + "/api/v1/searchStudent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(studentSearchForm),
        },
      );
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        console.log(data, "data");
        setSearchStudentData(data?.data);
      } else {
        setSearchStudentData([]);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, "inside catch fn");
      alert("Issue in getting student");
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <BackButton></BackButton>
      <div className="mt-10 flex flex-col flex-wrap items-center">
        {/* Search Input */}

        <section className="w-2/3">
          <section className="mt-8">
            <input
              type="text"
              placeholder="Search"
              name="searchFor"
              value={studentSearchForm.searchFor}
              onChange={searchStudentChangeHandler}
              className="mb-4 w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Select Dropdown */}
            <select
              name="searchOption"
              value={studentSearchForm.searchOption}
              onChange={searchStudentChangeHandler}
              className="mb-4 w-full md:w-1/4 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Select">Select</option>
              {studentSearchFilters.map((s) => (
                <option key={s.filter_value} value={s.filter_value}>
                  {s.filter_name}
                </option>
              ))}
            </select>

            {/* Search Button */}
            <button
              onClick={searchStudentSubmitHandler}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition md:mx-3"
            >
              Search
            </button>
          </section>

          {/* Search Results */}
          <section className="flex flex-col flex-wrap items-start mt-6">
            <div className="text-lg font-semibold mb-4">
              Search Results for: {studentSearchForm.searchFor}
            </div>

            {searchedStudentData?.length ? (
              <div className="space-y-4 w-4/5">
                {searchedStudentData.map((student) => (
                  <div
                    key={student.userId}
                    className="border p-4 rounded-lg shadow-sm bg-gray-50"
                  >
                    <div>
                      <span className="font-semibold">User ID:</span>{" "}
                      {student.userId}
                    </div>
                    <div>
                      <span className="font-semibold">Full Name:</span>{" "}
                      {student.fullName}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span>{" "}
                      {student.email}
                    </div>
                    <div>
                      <span className="font-semibold">Phone Number:</span>{" "}
                      {student.phoneNumber}
                    </div>
                    <div>
                      <span className="font-semibold">Payment:</span>{" "}
                      {student.payment}
                    </div>
                    <div>
                      <span className="font-semibold">Enrolled At:</span>{" "}
                      {new Date(Number(student.enrolledAt)).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Expires At:</span>{" "}
                      {new Date(Number(student.expiresAt)).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 mt-4">No Data Found</div>
            )}
          </section>
        </section>
      </div>
    </>
  );
}
