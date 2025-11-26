import { useNavigate } from "react-router-dom";
import EnrollmentForm from "../components/EnrollmentForm";

export default function(){

    const redirect = useNavigate();

    return (<>
    <button onClick={()=>redirect(-1)}> Back </button>
    <EnrollmentForm/></>)
}