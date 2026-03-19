import React, { useState } from "react";
import LoginPage from "./components/loginpage/LoginPage";
import MenuBar from "./components/menubar/MenuBar";
import Device from "./components/device/Device";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const receiveValue = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div>
        {localStorage.getItem('token')==null?activeIndex==1?
        <LoginPage handleLogin={receiveValue} />:
        <Dashboard />:
        <Device />
        }
    </div>
  );
}

export default App;
