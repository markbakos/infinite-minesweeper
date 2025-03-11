import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Game} from "./pages/Game.tsx";
import {Home} from "./pages/Home.tsx";
import {SignUp} from "./pages/SignUp.tsx";
import {Login} from "./pages/Login.tsx";
import {Header} from "./components/Header.tsx";

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/infinite" element={<Game game="infinite" />} />
                    <Route path="/normal" element={<Game game="normal" />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App