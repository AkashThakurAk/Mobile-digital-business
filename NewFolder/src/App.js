import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from './Components/Signup';
import Card from './Components/Card';
import Profile from './Components/Profile';
import Admin from './Components/Admin';
import User from './Components/User';
import VirtualCard from './Components/VirtualCard';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<VirtualCard />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:email/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<User />} />
          <Route path="/digitalcard/:username" element={<Card />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
