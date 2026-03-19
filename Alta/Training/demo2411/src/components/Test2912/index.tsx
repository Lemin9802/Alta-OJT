import React, { useEffect, useRef, useState  } from 'react';
const Test2912 = () => {
    const cameraRef=useRef<HTMLVideoElement | null>(null);
    const videoConstrains: MediaStreamConstraints={
        audio: false,
        video: {width:900, height:500}
    };
    useEffect(()=>{
        async function getCameraData(){
            const stream = await navigator.mediaDevices.getUserMedia(videoConstrains);
            if(cameraRef.current){
                cameraRef.current.srcObject=stream;
            }
        }
        getCameraData();
    },[]);

    // const [result, setResult] = useState<number>(1)
    // const [myNumber, setMyNumber] = useState<number>(0)
    // const renderedCount = useRef<number>(1);
    // const pRef = useRef<HTMLParagraphElement | null>(null);
    // const handleCalculate = () => {
    //     let product = 1;
    //     for (let i = 1; i <= myNumber; i++) {
    //         product *= i;
    //     }
    //     setResult((prev)=>{
    //         if(prev!==product){
    //             renderedCount.current += 1;
    //             if(pRef.current!==null)
    //                 pRef.current.innerHTML = `Số lần render: ${renderedCount.current}`;
    //         }
    //         return product;
    //     });
    // }
    return (
        // <div>
        //     <h1>Practicing useRef with React</h1>
        //     <input type="number" id="myNumber" value={myNumber}
        //     onChange={(e) => {
        //         renderedCount.current += 1;
        //         if (pRef.current !== null) {
        //             pRef.current.innerHTML = `Số lần render: ${renderedCount.current}`;
        //         }
        //         setMyNumber(Number(e.currentTarget.value));
        //     }}
        //     />
        //     <button id="myButton" onClick={handleCalculate}>Tính</button>
        //     <p id="ketqua">{result}</p>
        //     <p ref={pRef}></p>
        // </div>
        <video width="640" height="360" controls ref={cameraRef}>
            {/* <source src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4" />
            Your browser does not support the video tag. */}
        </video>
    );
}
export default Test2912;