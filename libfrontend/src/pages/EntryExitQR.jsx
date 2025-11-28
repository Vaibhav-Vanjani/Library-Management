import QrCode from "../components/QrCode";
import QrScanner from "./QR";
import QrAdminListener from "../components/QrListner";
import LoginForm from '../components/LoginForm';

export default function(){
    return (<>
        {/* <QrCode userId="A2" /> */}
        <QrAdminListener userId="A2" />
        <QrScanner currentUser={{ id: "A1", name: "John" }} />
        <LoginForm/>
    </>)
}