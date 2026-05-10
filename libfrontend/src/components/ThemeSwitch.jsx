import { useState } from "react"

export default function(){
    const [isDarkTheme,setIsDarkTheme] = useState(true);
    if(isDarkTheme){
          document.documentElement.classList.add('dark')
          document.getElementById('root').classList.add('dark:bg-black');
    }
    return <>
    {!isDarkTheme ? <span onClick={()=>{
            if(!document.documentElement.classList.contains('dark'))
            {
                document.documentElement.classList.add('dark')
                setIsDarkTheme(prev=>!prev);
                document.getElementById('root').classList.add('dark:bg-black');
            }
        }} className="cursor-pointer text-2xl">☀️</span>
    :
    <span onClick={()=>{
                    if(document.documentElement.classList.contains('dark'))
                    {
                        document.documentElement.classList.remove('dark')
                        setIsDarkTheme(prev=>!prev);
                    }
        }} className="cursor-pointer text-2xl">🌙</span>
    }
    </>
}