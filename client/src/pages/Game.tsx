import Grid from "../components/Grid.tsx";
import NormalGame from "../components/NormalGame.tsx";

interface GameProps {
    game: "infinite" | "normal"
}

export const Game: React.FC<GameProps> = (props) => {
    return (
        <div className="space-y-5 flex flex-col items-center bg-gray-600 w-screen min-h-screen">
            {props.game==="infinite" && <Grid /> }
            {props.game==="normal" && <NormalGame /> }
        </div>
    )
}