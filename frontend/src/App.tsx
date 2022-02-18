import React from "react";
import { IsLogin } from "./components/IsLogin";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { UserProvider } from "./providers/UserProvider";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Register />
        <Login />
        <IsLogin />
      </UserProvider>
    </div>
  );
}

export default App;
