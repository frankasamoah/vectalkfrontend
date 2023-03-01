import { Route, Routes } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import SignIn from "./components/auth/SignIn";
// import SignUp from "./components/auth/SignUp";
import SignUp from "./components/auth/SignUp";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<></>} />
    </Routes>
  );
}

export default App;
