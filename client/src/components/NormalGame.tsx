import {Cell, Score} from "../types"
import {useEffect, useState} from "react";
import {Bomb, Flag, RefreshCw} from "lucide-react";

const NormalGame: React.FC = () => {
    const size = 15
    const bombCount = 35
    const [grid, setGrid] = useState<Cell[][]>([])
    const [isGameOver, setIsGameOver] = useState(false)
    const [isGameWon, setIsGameWon] = useState(false)
    const [isFlagging, setIsFlagging] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [bestTime, setBestTime] = useState<Score>({score: null, time: null});

    useEffect(() => {
        initializeGrid()
    }, [size, bombCount])

    useEffect(() => {
        if (!startTime || isGameOver) return

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime())))
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime, isGameOver])

    useEffect(() => {
        const time = localStorage.getItem("bestScoreTime_normal")

        if (time !== null){
            setBestTime({
                score: null,
                time: parseInt(time)})
        }
    }, []);

    const initializeGrid = () => {
        const newGrid : Cell[][] = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => ({
                revealed: false,
                value: 0,
                flagged: false,
            }))
        )

        let placedBombs = 0
        while (placedBombs < bombCount) {
            const row = Math.floor(Math.random() * size)
            const col = Math.floor(Math.random() * size)
            if (newGrid[row][col].value !== "bomb") {
                newGrid[row][col].value = "bomb"
                placedBombs++
            }
        }

        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ]

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (newGrid[row][col].value === "bomb") continue

                let bombCount = 0;
                for (const [dx, dy] of directions) {
                    const newRow = row + dx
                    const newCol = col + dy

                    if (
                        newRow >= 0 &&
                        newRow < size &&
                        newCol >= 0 &&
                        newCol < size &&
                        newGrid[newRow][newCol].value === "bomb"
                    ) {
                        bombCount++
                    }
                }

                newGrid[row][col].value = bombCount
            }
        }

        setGrid(newGrid)
    }

    const revealCell = (newGrid: Cell[][], row: number, col: number) => {
        if (newGrid[row][col].revealed || newGrid[row][col].value === "bomb")
        {
            return newGrid
        }

        newGrid[row][col].revealed = true

        if (newGrid[row][col].value === 0) {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ]

            for (const [dx, dy] of directions) {
                const newRow = row + dx
                const newCol = col + dy

                if (
                    newRow >= 0 &&
                    newRow < size &&
                    newCol >= 0 &&
                    newCol < size
                ) {
                    newGrid = revealCell(newGrid, newRow, newCol)
                }
            }
        }

        return newGrid
    }

    const handleClick = (row: number, col: number) => {
        if(isGameOver) return

        if (!startTime) {
            setStartTime(new Date())
        }

        if(isFlagging) {
            setGrid((prev) => {
                const newGrid = prev.map((row) =>
                    row.map((cell) => ({...cell}))
                )
                newGrid[row][col].flagged = !newGrid[row][col].flagged
                return newGrid
            })
        } else {
            setGrid((prev) => {
                const newGrid: Cell[][] = prev.map(row => row.map(cell => ({...cell})))
                if (newGrid[row][col].flagged) return newGrid;

                if (newGrid[row][col].value === "bomb") {
                    newGrid[row][col].revealed = true
                    setIsGameOver(true)
                    return newGrid
                }

                const updatedGrid = revealCell(newGrid, row, col)

                if (isMapFinished(updatedGrid)) {
                    setIsGameOver(true)
                    setIsGameWon(true)
                    if (bestTime.time === null || elapsedTime < bestTime.time) {
                        setBestTime({score: null, time: elapsedTime})
                        localStorage.setItem('bestScoreTime_normal', elapsedTime.toString())
                    }

                }

                return updatedGrid
            })
        }
    }

    const handleRightClick = (e: React.MouseEvent, row: number, col: number)=> {
        e.preventDefault()
        if(isGameOver) return

        setGrid((prev) => {
            const newGrid = prev.map((row) =>
                row.map((cell) => ({...cell}))
            )
            newGrid[row][col].flagged = !newGrid[row][col].flagged
            return newGrid
        })
    }

    const isMapFinished = (grid: Cell[][]): boolean => {
        for (let row of grid) {
            for (let cell of row) {
                if (!cell.revealed && cell.value !== "bomb") {
                    return false
                }
            }
        }
        return true
    }

    const restartGame = () => {
        initializeGrid()
        setIsGameWon(false)
        setIsGameOver(false)
        setElapsedTime(0)
        setStartTime(null)
    }

    const getNumberColor = (value: number | "bomb") => {
        switch (value) {
            case 1:
                return "text-blue-700"
            case 2:
                return "text-green-700"
            case 3:
                return "text-red-500"
            case 4:
                return "text-blue-900"
            case 5:
                return "text-red-800"
            case 6:
                return "text-cyan-700"
            case 7:
                return "text-purple-700"
            case 8:
                return "text-gray-600"
            default:
                return ""
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000)
        const seconds = Math.floor((time % 60000) / 1000)
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }


    return (
        <div className="flex flex-col items-center justify-center p-4 min-w-[20vw]">
            {isGameWon &&
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-sm w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Congratulations!</h2>
                    <p className="text-gray-600 mb-2">You completed the map!</p>
                    <p className="text-gray-600 mb-4 flex justify-between">
                        <div>
                            Current time: <span className="font-semibold">{formatTime(elapsedTime)}</span>
                        </div>
                        <div>
                            Best Time: <span className="font-semibold">{bestTime.time === null ? formatTime(elapsedTime) : formatTime(bestTime.time)}</span>
                        </div>

                    </p>
                    <button
                        onClick={restartGame}
                        className="mt-4 w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-gray-900 font-semibold rounded-md transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <RefreshCw className="w-5 h-5"/>
                        <span>New Game</span>
                    </button>
                </div>
            </div>
            }

            <div className="flex justify-between items-center w-1/2 min-w-[80vw] md:min-w-[50vw] lg:min-w-[20vw]">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-400">Best Time</h2>
                    <p className="text-3xl font-bold text-gray-200">{bestTime.time ? formatTime(bestTime.time) : "No time yet!"}</p>
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-400">Time</h2>
                    <p className="text-3xl font-bold text-gray-200">{formatTime(elapsedTime)}</p>
                </div>
            </div>

            <button
                onClick={() => setIsFlagging(!isFlagging)}
                className={`w-full py-2 px-4 rounded-md text-gray-900 font-semibold transition-all duration-300 my-2 ${
                    isFlagging
                        ? 'bg-red-400 hover:bg-red-500'
                        : 'bg-blue-400 hover:bg-blue-500'
                }`}
            >
                {!isFlagging ? "Enable Flagging" : "Disable Flagging"}
            </button>

            <div className="inline-block border-2 border-gray-500">
                {grid.map((row, rowIndex) =>
                    <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-8 h-8 border border-gray-500 bg-gray-200 ${
                                    cell.revealed
                                        ? cell.value === "bomb"
                                            ? "bg-red-400"
                                            : "bg-gray-400"
                                        : "hover:bg-gray-300"
                                }`}
                                onClick={() => handleClick(rowIndex, colIndex)}
                                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                            >
                                {cell.revealed && cell.value === "bomb" && (
                                    <p className="select-none text-lg font-semibold flex justify-center items-center h-full">
                                        <Bomb className="w-5 h-5 text-red-900"/>
                                    </p>
                                )}
                                {cell.revealed && cell.value !== 0 && cell.value !== "bomb" && (
                                    <p className={`select-none text-center text-2xl font-bold ${getNumberColor(cell.value)}`}>
                                        {cell.value}
                                    </p>
                                )}
                                {cell.flagged && !cell.revealed && (
                                    <p className="select-none text-lg font-semibold flex items-center justify-center h-full">
                                        <Flag className="w-6 h-6 text-red-600"/>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={restartGame}
                className="mt-4 w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-gray-900 font-semibold rounded-md transition-all duration-300 flex items-center justify-center space-x-2"
            >
                <RefreshCw className="w-5 h-5"/>
                <span>New Game</span>
            </button>
        </div>
    )
}

export default NormalGame