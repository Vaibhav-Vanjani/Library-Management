import { useEffect, useState } from "react";

export default function () {
  const [entryExitRows,setEntryExitRows] = useState([]);
  const [loading,setLoading] = useState(true);  
  useEffect(() => {
    async function getAllEntryExitColumn() {
        try{
            const res = await fetch("http://localhost:3001/api/entryExitView/");
            const data = await res.json();

            if (data.data) {
                setEntryExitRows(data.data);
            }
        } catch (error) {
            console.log(error,"inside qr listner"); 
        }
        setLoading(false);
    }
    getAllEntryExitColumn();
 },[]);
    

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <section className="flex">
        <div>{"USER ID"} | </div>
        <div>{"ENTRY TIME"} | </div>
        <div>{"EXIT TIME"}</div>
        <hr></hr>
    </section>
    {
        

        entryExitRows?.length && entryExitRows.map((row)=>{

            const entryTime = (Number)(row.entryTime);
            const exitTime = (Number)(row.exitTime);
            return <>
                <section key={row.userId} className="flex">
                    <div>{row.userId} | </div>
                    <div>{(new Date(entryTime).getHours() + ":" + new Date(entryTime).getMinutes()).toString()} | </div>
                    <div>{(new Date(exitTime).getHours() + ":" + new Date(exitTime).getMinutes()).toString()}</div>
                    <hr></hr>
                 </section>
            </>
        })
    }
    </>
  );
}
