import {useNavigate} from 'react-router-dom';

export default function(){
    const redirect = useNavigate();

    const button_list = [
        {
            "cardName":"Pending Payment",
            "goto":"/pendingPayment"
        },
        {
            "cardName":"Enrollment Form",
            "goto":"/enroll"
        }
    ]


    return (<>
        {
            button_list.map((card)=>{
                return (<div onClick={()=>redirect(card.goto)}>
                    <div>{card.cardName}</div>
                </div>)
            })
        }
    </>)
}