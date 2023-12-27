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

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<VirtualCard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<User />} />
          <Route path="/virtualcard/:username" element={<Card />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
