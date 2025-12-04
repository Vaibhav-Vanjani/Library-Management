import { createContext, useContext, useState } from "react";

const StudentContext = createContext();

export const useStudentContext = () => useContext(StudentContext);

export default function StudentContextProvider({ children }) {
  const [pendingDefaulter, setPendingDefaulter] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});

  const value = {
    pendingDefaulter,
    setPendingDefaulter,
    loggedInUser,
    setLoggedInUser,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}
