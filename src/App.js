import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeamData from './components/TeamData';
import Home from './components/Home';
import NavBar from './components/NavBar';
import PlayerData from './components/PlayerData';


function App() {
    return (
        <>
        <NavBar />
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/team/:teamID" element={<TeamData />} />
                <Route path="/player/:playerName" element={<PlayerData />} />
            </Routes>
      </Router> 
      </>  
    );
}

export default App;
