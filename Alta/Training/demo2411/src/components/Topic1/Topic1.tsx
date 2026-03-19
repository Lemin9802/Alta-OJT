import React, {useEffect, useState, useContext} from "react";
import { MyContext } from '../../App';

const Topic1 = () => {
    const [status, setStatus] = useState(false);
    const myContextValue = useContext(MyContext);
    useEffect(()=>{
        console.log("Hello")
    }, [status]);
    return(
        <div>
                <h1>This is Topic 1.</h1>
                <h2>The {myContextValue} Sai Gon fairy</h2>
                <button onClick={()=>setStatus(!status)}>Click</button>
        </div>    
    )
};

export default Topic1;