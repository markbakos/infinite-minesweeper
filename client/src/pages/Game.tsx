import Grid from "../components/Grid.tsx";

export const Game: React.FC = () => {
    return (
        <div className="m-5">
            <h1 className="text-2xl text-center">Infinite Minesweeper</h1>
            <Grid />
        </div>
    )
}