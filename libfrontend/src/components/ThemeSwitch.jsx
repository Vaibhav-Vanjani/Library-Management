import { useState } from "react"

export default function(){
    const [isDarkTheme,setIsDarkTheme] = useState(false);
    return <>
    {!isDarkTheme ? <span onClick={()=>{
            if(!document.documentElement.classList.contains('dark'))
            {
                document.documentElement.classList.add('dark')
                setIsDarkTheme(prev=>!prev);
                document.getElementById('root').classList.add('dark:bg-black');
            }
        }} className="text-2xl">🌙</span>
    :
    <span onClick={()=>{
                    if(document.documentElement.classList.contains('dark'))
                    {
                        document.documentElement.classList.remove('dark')
                        setIsDarkTheme(prev=>!prev);
                    }
        }} className="text-2xl">☀️</span>
    }
    </>
}