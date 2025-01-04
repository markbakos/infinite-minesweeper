import { Cell } from "../types"
import {useEffect, useState} from "react";

const Grid: React.FC = () => {
    const size = 10
    const bombCount = 15
    const [grid, setGrid] = useState<Cell[][]>([])
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        initializeGrid()
    }, [size, bombCount]);

    const initializeGrid = () => {
        const newGrid : Cell[][] = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => ({
                revealed: false,
                value: 0,
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
        if(!isGameOver){
            setGrid((prev) => {
                const newGrid: Cell[][] = prev.map(row => row.map(cell => ({...cell})))

                if (newGrid[row][col].value === "bomb") {
                    newGrid[row][col].revealed = true
                    setIsGameOver(true)
                    return newGrid
                }

                return revealCell(newGrid, row, col)
            })
        }

    }

    return (
        <div className="inline-block">
            {grid.map((row, rowIndex) =>
                <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-8 h-8 border border-gray-500 bg-gray-200  ${cell.revealed ? cell.value === "bomb" ? "bg-red-500" : "bg-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {cell.revealed && cell.value === "bomb" && <p className="select-none text-center text-lg font-semibold">💣</p>}
                            {cell.revealed && cell.value !== 0 && cell.value !== "bomb" && <p className="select-none text-center text-lg font-semibold">{cell.value}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Grid