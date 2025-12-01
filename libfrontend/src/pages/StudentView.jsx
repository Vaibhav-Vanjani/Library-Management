import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import {useStudentContext} from '../context/StudentContext';

const QR_CARD_NAME = "Entry/Exit";
const PAYMENT_CARD_NAME = "Payment";
const QR_REDIRECT_TO = "/student/QRScanner";
const PAYMENT_REDIRECT_TO = "/student/payment";

export default function () {
    const navigate = useNavigate();
    const {loggedInUser} = useStudentContext();
    console.log(loggedInUser.expiresAt,"loggedInUser.expiresAt");
    const expiredStudent = (loggedInUser.expiresAt < Date.now());

    const button_list = [
        { cardName: QR_CARD_NAME, goto: QR_REDIRECT_TO ,props:{}},
        { cardName: PAYMENT_CARD_NAME, goto: PAYMENT_REDIRECT_TO, props:{}}
    ];

    return (
        <>
        {expiredStudent ? <div className='bg-red-500/50 text-center'>Pending Payment</div> : <></>}
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="flex flex-col gap-6">
                {button_list.map((card, index) => (
                    
                    <div
                        key={index}
                        onClick={() => navigate(card.goto)}
                        className="cursor-pointer w-64 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all text-center"
                    >
                        <div className="text-xl font-semibold text-gray-800">
                            {card.cardName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
