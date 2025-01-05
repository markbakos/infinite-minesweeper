import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Game} from "./pages/Game.tsx";
import {Home} from "./pages/Home.tsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/infinite" element={<Game />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App