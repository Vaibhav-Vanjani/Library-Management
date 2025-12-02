import { useState } from "react";
import Razorpay from 'razorpay';
import { useStudentContext } from "../context/StudentContext";
import { useNavigate } from "react-router-dom";

const ONE_MONTH_TUTION_FEE = 1200;
const ONE_MONTH_LOCKER_FEE = 400;


export default function(){

    console.log(process.env.REACT_APP_RAZORPAY_KEY_ID,"process.env.REACT_APP_RAZORPAY_KEY_ID");
    const {loggedInUser} = useStudentContext();
    const redirect = useNavigate();
    const [formData,setFormData] = useState({
        "months":1,
        "locker": 'true',
        "Total_payment":1600
    })

    console.log("formData",formData);
    function paymentFormChangeHandler(event){
        const {name,value} = event.target;
        console.log({name,value},"paymentFormChangeHandler");
        setFormData(prev=>{
            const newOption = {...prev,[name]:value};
            newOption.Total_payment = newOption.months*ONE_MONTH_TUTION_FEE + 
                                      (newOption.locker === 'true' ? newOption.months*ONE_MONTH_LOCKER_FEE : 0);
            return newOption;
        })
    }

    async function paymentFormSubmitHandler(event){
        event.preventDefault();
        console.log(formData,"Payment Form Data");
        

        try {
            const response = await fetch('http://localhost:3002/api/v1/payment',
                {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(formData),
                    credentials:"include"
                }
            );
            const data = await response.json();
            if(response.ok){
               
                console.log(data,"payment data from backend");

                 const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
                    amount: formData.Total_payment*100, // Amount is in currency subunits.
                    currency: 'INR',
                    name: 'BEST ACHIVERS',
                    description: 'Test Transaction',
                    order_id: data.data.id, // This is the order_id created in the backend
                    handler: async function (response){
                        const razorpay_payment_id = response.razorpay_payment_id;
                        const razorpay_order_id = response.razorpay_order_id;
                        const razorpay_signature = response.razorpay_signature;
                        const order_id = data.data.id;
                        const userId = loggedInUser.userId;
                        const payment = (String)(formData.Total_payment);
                        const currentDate = new Date();
                        currentDate.setMonth(currentDate.getMonth()+formData.months);
                        const expiresAt = currentDate.getTime().toString();

                        const request = { razorpay_payment_id,razorpay_order_id,razorpay_signature,
                                order_id,userId,payment,expiresAt };
                        console.log("request",request);

                        try {
                             const response = await fetch('http://localhost:3002/api/v1/verify-payment',
                                {
                                    method:"POST",
                                    headers:{"Content-Type":"application/json"},
                                    body:JSON.stringify(request),
                                    credentials:"include"
                                }
                            );
                            const data = await response.json();
                            console.log("data",data);
                            if(response.ok && data?.success){
                                redirect('/success-payment-verified');
                            }
                            else{
                                alert('Payment Failure');
                            }     
                        } catch (error) {
                            console.log(error);
                            alert('Payment Failure');
                        }
                       

                    },
                    prefill: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    contact: '9876543210',
                    },
                    theme: {
                    color: '#F37254',
                    },
                    modal: {
                    // ondismiss: handlePaymentCancel,
                    },
                };  

                console.log("options:",options);

                 const razorpayInstance = new window.Razorpay(options);
       
        console.log(razorpayInstance);
        console.log('this is razorpay instance value');
        
        // You can handle payment failure by listening to the failure event.
        razorpayInstance.on("payment.failed", async (response) => {
               console.log(response.error.description);
        });

        razorpayInstance.open();

            }
            else{
                alert(data.message);
            }
        } catch (error) {
            console.log(error,"Error from backend");
        }
    }

    return (
        <>
            <div>
                <section>
                    <form onSubmit={paymentFormSubmitHandler}>
                        <label for="months">Months :</label>
                        <select value={formData.months} name="months" id="months" onChange={paymentFormChangeHandler}>
                            <option value={"select"}>Select</option>
                            {
                               (new Array(36)).fill(-1).map((value,index)=>{
                                    return <option name="months">{index+1}</option>
                               })
                            }           
                        </select>
                        
                        <label for="locker">Locker :</label>
                        
                        <label for="locker-yes">Yes</label>
                        <input type="radio" 
                               name="locker" 
                               id="locker-yes" 
                               value={true}
                               checked={formData.locker === 'true'} 
                               onChange={paymentFormChangeHandler}>
                        </input>

                        <label for="locker-no">No</label>
                        <input type="radio" 
                               name="locker" 
                               id="locker-no" 
                               value={false}
                               checked={formData.locker === 'false'} 
                               onChange={paymentFormChangeHandler}>
                        </input>

                        <label for="total_payment">Total Payment: {formData.Total_payment}</label>    
                        <button>Submit</button>
                    </form>
                </section>
            </div>
        </>
    )
}