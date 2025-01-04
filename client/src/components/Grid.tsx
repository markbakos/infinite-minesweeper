import { Cell } from "../types"
import {useState} from "react";

const Grid: React.FC = () => {
    const size = 10
    const [grid, setGrid] = useState<Cell[][]>(
        Array.from({length: size}, () =>
            Array.from({length:size}, () => ({
                revealed: false,
                value: 0,
            }))
        )
    )

    const handleClick = (row: number, col: number) => {
        setGrid((prev) => {
            const newGrid = [...prev]
            newGrid[row][col] = { ...newGrid[row][col], revealed: true}
            return newGrid
        })
    }

    return (
        <div className="inline-block">
            {grid.map((row, rowIndex) =>
                <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-8 h-8 border border-gray-500 bg-gray-200 hover:bg-gray-300 ${cell.revealed ? "bg-gray-400" : "bg-gray-200"}`}
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Grid