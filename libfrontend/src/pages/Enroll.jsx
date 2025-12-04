import { useNavigate } from "react-router-dom";
import EnrollmentForm from "../components/EnrollmentForm";

export default function () {
  const redirect = useNavigate();

  return (
    <>
      <EnrollmentForm />
    </>
  );
}
