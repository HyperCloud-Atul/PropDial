import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// guest component 
import Home from "./pages/guest/Home";
import Navbar from "./component/Navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
