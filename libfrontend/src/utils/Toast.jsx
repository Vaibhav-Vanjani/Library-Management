export default function ({type,message}) {

     if(type === "SUCCESS"){
        return <div className="fixed top-0 right-2 bg-green-500/50 text-xl p-2">{message}</div>
     }
     else if(type === "FAILURE"){
         return <div className="fixed top-0 right-2 bg-red-500/50 text-xl p-2">{message}</div>
     }
     else if(type === "WARN"){
         return <div className="fixed top-0 right-2 bg-yellow-500/50 text-xl p-2">{message}</div>
     } 
}
