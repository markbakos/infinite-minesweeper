import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Game} from "./pages/Game.tsx";
import {Home} from "./pages/Home.tsx";
import {SignUp} from "./pages/SignUp.tsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/infinite" element={<Game game="infinite" />} />
                    <Route path="/normal" element={<Game game="normal" />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App