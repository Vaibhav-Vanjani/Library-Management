import { useNavigate } from "react-router-dom";

export default function(){
    const redirect = useNavigate();

    const pendingDefaulter = [{
                        "name":"Vaibhav Vanjani",
                        "ID":"1245",
                        "Enrolled_At":"24 September",
                        "Last_Payment_Made_On":"25 November",
                        "Payment":"1200",
                        "Expires_In":"25 december"}
                    ];

    return <>
        <button onClick={()=>redirect(-1)}> Back </button>
        {
            pendingDefaulter.map((defaulter)=>{
                return (<section>
                    <div>{defaulter.name}</div>
                    <div>{defaulter.ID}</div>
                    <div>{defaulter.Enrolled_At}</div>
                    <div>{defaulter.Last_Payment_Made_On}</div>
                    <div>{defaulter.Payment}</div>
                    <div>{defaulter.Expires_In}</div>           
                </section>)
            })
        }
    </>
}