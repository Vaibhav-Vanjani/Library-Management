import { useNavigate } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import UserScanNotification from '../components/UserScanNotification';

const PENDING_PAYMENT_CARD_NAME = "Pending Payment";
const ENROLLMENT_FORM_CARD_NAME = "Enrollment Form";
const ENTRY_EXIT_CARD_NAME = "Entry/Exit";
const EARNING_CARD_NAME = "Earning";
const SEARCH_STUDENT_CARD_NAME = "Search Student";
const ACTIVE_STUDENT_CARD_NAME = "Active Student";

const PENDING_PAYMENT_REDIRECT_TO = "/admin/pendingPayment";
const ENROLLMENT_FORM_REDIRECT_TO = "/admin/enroll";
const ENTRY_EXIT_REDIRECT_TO = "/admin/EntryExitView";
const EARNING_REDIRECT_TO = "/earning";
const SEARCH_STUDENT_REDIRECT_TO = "/searchStudent";
const ACTIVE_STUDENT_REDIRECT_TO = "/activeStudent";

export default function () {
    const navigate = useNavigate();
    const {pendingDefaulter,setPendingDefaulter} = useStudentContext();
    const [loading,setLoading] = useState(true);
    const [userScan,setUserScan] = useState([]);
    console.log(userScan,"Admin userScan");

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
                else{
                    alert("Something Went Wrong while fetching pending payments !!");
                }
            } catch (error) {
                console.log(error,"inside getDefaulter - /defaulter call");
                alert("Something Went Wrong");
            }
            setLoading(false);
        }
        getDefaulter();

        const interval = setInterval(async function (params) {
            try {
                const response = await fetch('http://localhost:3001/api/check-scan');
                if(response.ok){
                    const data = await response.json();
                    if(data?.scannedBy?.length){
                        console.log("data.scannedBy",data.scannedBy);
                        setUserScan(data.scannedBy);
                    }
                }
            } catch (error) {
                console.log(error,"Check scan");
            }        
        },5000);

        return ()=>clearInterval(interval);
    },[]);

    const button_list = [
        { cardName: PENDING_PAYMENT_CARD_NAME, goto: PENDING_PAYMENT_REDIRECT_TO ,props:{pendingDefaulter}},
        { cardName: ENROLLMENT_FORM_CARD_NAME, goto: ENROLLMENT_FORM_REDIRECT_TO, props:{}},
        { cardName: ENTRY_EXIT_CARD_NAME, goto: ENTRY_EXIT_REDIRECT_TO, props:{}},
        { cardName: EARNING_CARD_NAME, goto: EARNING_REDIRECT_TO, props:{}},
        { cardName: SEARCH_STUDENT_CARD_NAME, goto: SEARCH_STUDENT_REDIRECT_TO, props:{}},
    ];

    return (
        <>
       <UserScanNotification userScan={userScan}/>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="flex gap-6 flex-wrap justify-center">
                {button_list.map((card, index) => (
                    
                    <div
                        key={index}
                        onClick={() => navigate(card.goto)}
                        className="cursor-pointer w-64 p-12 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all text-center"
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
