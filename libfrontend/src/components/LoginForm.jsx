import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../context/StudentContext";


export default function(){  
    const redirect = useNavigate();
    const [loginFormData,setLoginFormData] = useState({});
    const {loggedInUser,setLoggedInUser} = useStudentContext();
    useEffect(()=>{
        async function isLoggedIn() {
             try {
             const response = await fetch('http://localhost:3001/login',{
                method:"POST",
                credentials: "include",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(loginFormData),
            })

            if(response.ok){
                const data = await response.json();
                if(data?.data?.isAdmin){
                    setLoggedInUser(data.data);
                    redirect('/admin');
                }
                else{
                    setLoggedInUser(data.data);
                    redirect('/student')
                }
            }
        } catch (error) {
            console.log(error,"Inside loginFormSubmitHandler");
        }   
        }
        isLoggedIn();
    },[])

    function loginFormChangeHandler(event){
        const {name,value} = event.target;
        setLoginFormData(prev=>({...prev,[name]:value}));
    }

    async function loginFormSubmitHandler(event){
        event.preventDefault();
        try {
             const response = await fetch('http://localhost:3001/login',{
                method:"POST",
                credentials: "include",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(loginFormData),
            })

            if(response.ok){
                const data = await response.json();
                if(data?.data?.isAdmin){
                    redirect('/admin');
                }
                else{
                    redirect('/student')
                }
            }
            else{
                console.log(response);
                alert("Invalid Crendentials");
            }
        } catch (error) {
            console.log(error,"Inside loginFormSubmitHandler");
        }   
    }


    return <>
        <form onSubmit={loginFormSubmitHandler}>
            <input type="email" 
                   required 
                   onChange={loginFormChangeHandler}
                   placeholder="Enter Email"
                   name="email"
                   value={loginFormData["email"] ?? ""}
            />
             <input type="text" 
                   required 
                   onChange={loginFormChangeHandler}
                   placeholder="Enter User ID"
                   name="userId"
                   value={loginFormData["userId"] ?? ""}
            />    
            <button>Login</button>
        </form>
        </>
}