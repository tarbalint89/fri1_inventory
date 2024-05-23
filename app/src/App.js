import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import Adduser from './pages/AddUser';
import AddMobiles from './pages/AddMobile';
import History from './pages/History';
import AssignedMobile from './pages/AssignedMobile';
import Details from './pages/Details ';
import EditMobile from './pages/EditMobile';
import ScrapMobiles from './pages/ScrapMobiles';
import AddScrapMobile from './pages/AddScrapMobile';
import Cookies from "js-cookie";


// Global states
import { useSession } from "./globalStates/session.state";


// Components
import { LangProvider } from "./utils/context/LangContext";


// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";



// Styles
import "./styles/App.css";


function App() {
    const Navigate = useNavigate();
    const [sessionState, sessionAction] = useSession();


    useEffect(() => {
        if (!sessionState.name) {
            axios.post(`/api/Layout/get_session_data.php`).then(res => {
                if (res.data.errors == 0) {
                    sessionAction.setSession(res.data.session_data);
                } else {
                    return Navigate("/login");
                }
            })
        }
    }, []);


    return (
        <div className="App">
            <LangProvider>
                <Routes>
                <Route
                        path="/"
                        element={
                            Cookies.get("PHPSESSID") ? (
                                <Navigate to="/home" />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/storeMobile" element={<AddMobiles />} />
                    <Route path="/details/:email" element={<Details />} />
                    <Route path="/Adduser" element={<Adduser/>} />
                    <Route path="/editMobile/:assignmentId" element={<EditMobile/>} />
                    <Route path="/dashboard" element={<Dashboard></Dashboard>} />
                    <Route path="/history" element={<History></History>} />
                    <Route path="/scrapMobiles" element={<ScrapMobiles></ScrapMobiles>} />
                    <Route path="/assignedMobile" element={<AssignedMobile></AssignedMobile>} />
                    <Route path="/addscrapmobile" element={<AddScrapMobile></AddScrapMobile>} />
                    <Route path="/" element={sessionState.name ? <HomePage /> : <LoginPage />} />
                </Routes>
            </LangProvider>
        </div>
    );
}


export default App;
