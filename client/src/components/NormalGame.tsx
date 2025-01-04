import { Cell } from "../types"
import {useEffect, useState} from "react";

const NormalGame: React.FC = () => {
    const size = 20
    const bombCount = 50
    const [grid, setGrid] = useState<Cell[][]>([])
    const [isGameOver, setIsGameOver] = useState(false)
    const [isFlagging, setIsFlagging] = useState(false);

    useEffect(() => {
        initializeGrid()
    }, [size, bombCount]);

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
                return revealCell(newGrid, row, col)
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

    const restartGame = () => {
        initializeGrid()
        setIsGameOver(false)
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

    return (
        <>
            <button onClick={() => setIsFlagging(!isFlagging)} className="border-gray-600 border bg-gray-500 w-56 h-8 text-white text-lg">
                {!isFlagging ? "Enable Flagging" : "Disable Flagging"}
            </button>
            <div className="inline-block">
                {grid.map((row, rowIndex) =>
                    <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-8 h-8 border border-gray-500 bg-gray-200  ${cell.revealed ? cell.value === "bomb" ? "bg-red-500" : "bg-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                                onClick={() => handleClick(rowIndex, colIndex)}
                                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                            >
                                {cell.revealed && cell.value === "bomb" &&
                                    <p className="select-none text-center text-lg font-semibold">💣</p>}
                                {cell.revealed && cell.value !== 0 && cell.value !== "bomb" &&
                                    <p className={`select-none text-center text-2xl font-bold ${getNumberColor(cell.value)}`}>{cell.value}</p>}
                                {cell.flagged && !cell.revealed &&
                                    <p className="select-none text-center text-lg font-semibold">🚩</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={restartGame} className="border-gray-600 border bg-gray-500 w-32 h-8 text-white text-xl">New
                Game
            </button>
        </>

    )
}

export default NormalGame