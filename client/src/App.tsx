import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Game} from "./pages/Game.tsx";
import {Home} from "./pages/Home.tsx";
import NormalGame from "./components/NormalGame.tsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/infinite" element={<Game />} />
                    <Route path="/normal" element={<NormalGame />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App