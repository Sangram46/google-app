
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarTask from './components/NavbarTask';
import Signup from './components/Signup';
import Signin from './components/Signin';
import TaskPage from './components/TaskPage';

function MainContent() {
    const location = useLocation();

    return (
        <div>
            {location.pathname === "/tasks" ? <NavbarTask /> : <Navbar />}
            <div style={{ marginTop: "50px" }}></div>
            <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/tasks" element={<TaskPage />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <MainContent />
        </Router>
    );
}

export default App;
