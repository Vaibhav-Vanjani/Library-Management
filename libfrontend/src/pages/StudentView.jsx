import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const QR_CARD_NAME = "Entry/Exit";
const PAYMENT_CARD_NAME = "Payment";
const QR_REDIRECT_TO = "/qr";
const PAYMENT_REDIRECT_TO = "/payment";

export default function CardList() {
    const navigate = useNavigate();

    const button_list = [
        { cardName: QR_CARD_NAME, goto: QR_REDIRECT_TO ,props:{}},
        { cardName: PAYMENT_CARD_NAME, goto: PAYMENT_REDIRECT_TO, props:{}}
    ];

    return (
        <>
        {loading ? <Loader/> : <></>}
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
