import { useNavigate } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';

const PENDING_PAYMENT_CARD_NAME = "Pending Payment";
const ENROLLMENT_FORM_CARD_NAME = "Enrollment Form";
const PENDING_PAYMENT_REDIRECT_TO = "/pendingPayment";
const ENROLLMENT_FORM_REDIRECT_TO = "/enroll";

export default function CardList() {
    const navigate = useNavigate();
    const {pendingDefaulter,setPendingDefaulter} = useStudentContext();
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        async function getDefaulter() {
            try {
                const response = await fetch('http://localhost:3001/defaulter',{
                    method:"GET",
                    headers:{"Content-Type":"application/json"}
                })   

                if(response.ok){
                    const data = await response.json();
                    console.log(data,"getDefaulter -data");
                    setPendingDefaulter(data.data);
                }
            } catch (error) {
                console.log(error,"inside getDefaulter - /defaulter call");
                alert("Something Went Wrong");
            }
            setLoading(false);
        }
        getDefaulter();
    },[]);

    const button_list = [
        { cardName: PENDING_PAYMENT_CARD_NAME, goto: PENDING_PAYMENT_REDIRECT_TO ,props:{pendingDefaulter}},
        { cardName: ENROLLMENT_FORM_CARD_NAME, goto: ENROLLMENT_FORM_REDIRECT_TO, props:{}}
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
                        {card.cardName === PENDING_PAYMENT_CARD_NAME ? <span className='absolute top-1 right-3 bg-red-500/50 border-white px-2 rounded'>{pendingDefaulter.length}</span> : <></>}
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
