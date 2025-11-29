import QrCode from "../components/QrCode";
import QrScanner from "./QR";
import QrAdminListener from "../components/QrListner";
import LoginForm from '../components/LoginForm';
import { useNavigate } from "react-router-dom";

export default function(){

    const redirect = useNavigate();
    return (<>

        {/* <button onClick={()=>redirect('/QRcode')}>QRcode</button> */}
        <button onClick={()=>redirect('/QRAdminListner')}>QRAdminListner</button>
        <button onClick={()=>redirect('/QRScanner')}>QRScanner</button>
        <button onClick={()=>redirect('/EntryExitView')}>EntryExitView</button>
        
        

        {/* <QrCode userId="Admin_09po09poV#" />
        <QrAdminListener /> */}
        <QrScanner currentUser={{ id: "A1", name: "John" }} />
        <LoginForm/>
    </>)
}