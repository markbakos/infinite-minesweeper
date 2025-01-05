import Grid from "../components/Grid.tsx";

export const Game: React.FC = () => {
    return (
        <div className="space-y-5 flex flex-col items-center bg-gray-600 w-screen min-h-screen">
            <Grid />
        </div>
    )
}