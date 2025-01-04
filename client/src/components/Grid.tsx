import { Cell } from "../types"
import {useEffect, useState} from "react";

const Grid: React.FC = () => {
    const viewSize = 15
    const bombChance = 0.15
    const [grid, setGrid] = useState<Map<string, Cell>>(new Map())
    const [viewport, setViewport] = useState({ x: 0, y: 0})
    const [isGameOver, setIsGameOver] = useState(false)
    const [isFlagging, setIsFlagging] = useState(false)
    const [score, setScore] = useState(0);

    const getCellKey = (x: number, y: number) => `${x},${y}`

    const generateCells = (startX: number, startY: number, width: number, height: number) => {
        const newGrid = new Map(grid)

        for (let row = startY; row < startY + height; row++) {
            for (let col = startX; col < startX + width; col++) {
                const key = getCellKey(col, row)
                if (!newGrid.has(key)) {
                    const isBomb = Math.random() < bombChance
                    newGrid.set(key, {
                        revealed: false,
                        value: isBomb ? "bomb" : 0,
                        flagged: false,
                    })
                }
            }
        }

        for (let row = startY; row < startY + height; row++) {
            for (let col = startX; col < startX + width; col++) {
                const key = getCellKey(col, row)
                const cell = newGrid.get(key)!
                if (cell.value === "bomb") continue

                const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ]

                let bombCount = 0
                for(const [dx, dy] of directions) {
                    const neighborKey = getCellKey(col + dx, row + dy)
                    if (newGrid.get(neighborKey)?.value === "bomb") {
                        bombCount++
                    }
                }
                cell.value = bombCount
            }
        }
        setGrid(newGrid)
    }

    const handleMove = (dx: number, dy: number) => {
        const newViewport = {
            x: viewport.x + dx,
            y: viewport.y + dy,
        }
        setViewport(newViewport)

        generateCells(newViewport.x, newViewport.y, viewSize, viewSize)
    }

    const revealCell = (newGrid: Map<string, Cell>, x: number, y: number) => {
        const key = getCellKey(x,y)
        const cell = newGrid.get(key)

        if (!cell || cell.revealed || cell.value === "bomb") return

        cell.revealed = true

        if (cell.value === 0) {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ]

            for (const [dx, dy] of directions) {
                revealCell(newGrid, x+dx, y + dy)
            }
        }
    }

    const handleClick = (x: number, y: number) => {
        if(isGameOver) return

        if(isFlagging){
            const cellKey = getCellKey(x, y)
            const cell = grid.get(cellKey)

            if (cell && !cell.revealed) {
                cell.flagged = !cell.flagged
                setGrid(new Map(grid))
            }
        }
        else{
            setGrid((prev) => {
                const newGrid = new Map(prev)
                const key = getCellKey(x, y)
                const cell = newGrid.get(key)

                if (!cell || cell.flagged) return newGrid

                if (cell.value === "bomb") {
                    cell.revealed = true
                    setIsGameOver(true)
                    return newGrid
                }
                setScore(score+(Math.floor(Math.random() * (50 - 35 + 1) + 35)))

                revealCell(newGrid, x, y)
                return newGrid
            })
        }
    }

    useEffect(() => {
        generateCells(viewport.x, viewport.y, viewSize, viewSize)
    }, []);

    const handleFlag = (e: React.MouseEvent, x: number, y: number)=> {
        e.preventDefault()
        if(isGameOver) return

        const cellKey = getCellKey(x, y)
        const cell = grid.get(cellKey)

        if (cell && !cell.revealed) {
            cell.flagged = !cell.flagged
            setGrid(new Map(grid))
        }
    }

    const restartGame = () => {
        setIsGameOver(false)
        setScore(0)
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
            <h1 className="text-3xl font-semibold">{score}</h1>
            <button
                onClick={() => setIsFlagging(!isFlagging)}
                className="border-gray-600 border bg-gray-500 w-56 h-8 text-white text-lg"
            >
                {!isFlagging ? "Enable Flagging" : "Disable Flagging"}
            </button>
            <div className="mb-4 flex-col inline-flex items-center">
                <button className="border border-gray-400 bg-gray-300 w-12 h-12 font-medium"
                        onClick={() => handleMove(0, -2)}>Up
                </button>
                <div className="flex flex-row">
                    <button className="border border-gray-400 bg-gray-300 w-12 h-12 font-medium"
                            onClick={() => handleMove(-2, 0)}>Left
                    </button>
                    <div className="invisible w-12 h-12"></div>
                    <button className="border border-gray-400 bg-gray-300 w-12 h-12 font-medium"
                            onClick={() => handleMove(2, 0)}>Right
                    </button>
                </div>
                <button className="border border-gray-400 bg-gray-300 w-12 h-12 font-medium"
                        onClick={() => handleMove(0, 2)}>
                    Down
                </button>
            </div>

            <div className="inline-block">
                {[...Array(viewSize)].map((_, row) => (
                    <div key={row} className="flex">
                        {[...Array(viewSize)].map((_, col) => {
                            const x = viewport.x + col;
                            const y = viewport.y + row;
                            const cell = grid.get(getCellKey(x, y)) || { revealed: false, value: 0, flagged: false };

                            return (
                                <div
                                    key={`${row}-${col}`}
                                    className={`w-8 h-8 border border-gray-500 bg-gray-200 ${
                                        cell.revealed
                                            ? cell.value === "bomb"
                                                ? "bg-red-500"
                                                : "bg-gray-400"
                                            : "hover:bg-gray-300"
                                    }`}
                                    onClick={() => handleClick(x, y)}
                                    onContextMenu={(e) => handleFlag(e, x, y)}
                                >
                                    {cell.revealed && cell.value === "bomb" && (
                                        <p className="select-none text-center text-lg font-semibold">💣</p>
                                    )}
                                    {cell.revealed && cell.value !== 0 && cell.value !== "bomb" && (
                                        <p className={`select-none text-center text-2xl font-bold ${getNumberColor(cell.value)}`}>
                                            {cell.value}
                                        </p>
                                    )}
                                    {cell.flagged && !cell.revealed && (
                                        <p className="select-none text-center text-lg font-semibold">🚩</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <button
                onClick={restartGame}
                className="border-gray-600 border bg-gray-500 w-32 h-8 text-white text-xl"
            >
                New Game
            </button>
        </>

    )
}

export default Grid