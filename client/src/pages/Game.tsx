import Grid from "../components/Grid.tsx";

export const Game: React.FC = () => {
    return (
        <div className="m-5 space-y-5 flex flex-col items-center">
            <h1 className="text-2xl text-center">Infinite Minesweeper</h1>
            <Grid />
        </div>
    )
}