export default function(){
    return <>
        <span onClick={()=>{
           if(!document.documentElement.classList.contains('dark'))
           document.documentElement.classList.add('dark')
        }}>dark</span>
        <span onClick={()=>{
                    if(document.documentElement.classList.contains('dark'))
                    document.documentElement.classList.remove('dark')
        }}>light</span>
    </>
}