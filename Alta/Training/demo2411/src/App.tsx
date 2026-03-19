import React,{useState, createContext} from 'react';
import Topic1 from './components/Topic1/Topic1';
import Topic2 from './components/Topic2/Topic2';
import Home from './components/Home/Home';
import Test2912 from './components/Test2912';
export const MyContext = createContext<number>(2000);


function App() {
  const [componentIndex, setComponentIndex] = useState(1);
  return (
    // <MyContext.Provider value={2000} >
    // <div>
    //   <ul>
    //       <li><a onClick={()=>setComponentIndex(2)}>Topic 1</a></li>
    //       <li><a onClick={()=>setComponentIndex(3)}>Topic 2</a></li>
    //       <li><a onClick={()=>setComponentIndex(1)}>Home</a></li>
    //   </ul>    
    //   {componentIndex==1?<Home />:componentIndex==2?<Topic1 />:<Topic2 />}
    // </div> 
    // </MyContext.Provider>
    <Test2912 />
  );
}

export default App;