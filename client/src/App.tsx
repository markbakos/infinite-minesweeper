import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Game} from "./pages/Game.tsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Game />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App