import Grid from "../components/Grid.tsx";
import NormalGame from "../components/NormalGame.tsx";
import {Link} from "react-router-dom";
import {ChevronLeft} from "lucide-react";

interface GameProps {
    game: "infinite" | "normal"
}

export const Game: React.FC<GameProps> = (props) => {
    return (
        <div className="flex flex-col bg-gray-600 w-screen min-h-screen">
            <div>
                <Link to="/" className="text-4xl font-semibold text-white absolute top-4 left-4">
                    <ChevronLeft className="w-16 h-16"/>
                </Link>
            </div>
            <div className="flex justify-center">
                { props.game === "infinite" ? <Grid /> : <NormalGame /> }
            </div>

        </div>
    )
}