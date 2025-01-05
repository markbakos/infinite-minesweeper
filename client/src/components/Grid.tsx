import { Cell, Score } from "../types"
import React, {useEffect, useState} from "react"
import {Bomb, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Flag, RefreshCw} from "lucide-react";

const Grid: React.FC = () => {
    const viewSize = 15
    const bombChance = 0.15
    const [grid, setGrid] = useState<Map<string, Cell>>(new Map())
    const [viewport, setViewport] = useState({ x: 0, y: 0})
    const [isGameOver, setIsGameOver] = useState(false)
    const [isFlagging, setIsFlagging] = useState(false)
    const [score, setScore] = useState(0)
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [bestScore, setBestScore] = useState<Score>({score: null, time: null})

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
        else{
            setScore(score+(Math.floor(Math.random() * (50 - 35 + 1) + 35)))
        }
    }

    const handleClick = (x: number, y: number) => {
        if(isGameOver) return

        if (!startTime) {
            setStartTime(new Date())
        }

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

                    if(bestScore.score === null || bestScore.time === null || score > bestScore.score || (score === bestScore.score && elapsedTime < bestScore.time)){
                        setBestScore({score: score, time: elapsedTime})
                        localStorage.setItem('bestScore_infinite', score.toString())
                        localStorage.setItem('bestScoreTime_infinite', elapsedTime.toString())
                    }


                    setStartTime(null)
                    return newGrid
                }

                revealCell(newGrid, x, y)
                return newGrid
            })
        }
    }

    useEffect(() => {
        generateCells(viewport.x, viewport.y, viewSize, viewSize)

        const score = localStorage.getItem("bestScore_infinite")
        const time = localStorage.getItem("bestScoreTime_infinite")

        if (score !== null && time !== null){
            setBestScore({
                score: parseInt(score),
                time: parseInt(time)})
        }
    }, []);

    useEffect(() => {
        if (!startTime || isGameOver) return

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime())))
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime, isGameOver]);

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
        setElapsedTime(0)
        setStartTime(null)
        const initialViewport = { x: 0, y: 0 }
        setViewport(initialViewport)

        const newGrid = new Map<string, Cell>()
        for (let row = initialViewport.y; row < initialViewport.y + viewSize; row++) {
            for (let col = initialViewport.x; col < initialViewport.x + viewSize; col++) {
                const isBomb = Math.random() < bombChance
                const key = getCellKey(col, row)
                newGrid.set(key, {
                    revealed: false,
                    value: isBomb ? "bomb" : 0,
                    flagged: false,
                })
            }
        }

        for (let row = initialViewport.y; row < initialViewport.y + viewSize; row++) {
            for (let col = initialViewport.x; col < initialViewport.x + viewSize; col++) {
                const key = getCellKey(col, row)
                const cell = newGrid.get(key)!

                if (cell.value === "bomb") continue

                const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1], [1, 0], [1, 1],
                ]

                let bombCount = 0;
                for (const [dx, dy] of directions) {
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
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="flex justify-between items-center w-1/2">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-400">Score</h2>
                    <p className="text-3xl font-bold text-gray-200">{score.toLocaleString()}</p>
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-400">Time</h2>
                    <p className="text-3xl font-bold text-gray-200">{formatTime(elapsedTime)}</p>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-gray-400 text-lg font-semibold">Best score:</h1>
                {bestScore.score !== null && bestScore.time !== null ?
                    <div className="text-xl font-bold text-gray-200">
                        {bestScore.score.toLocaleString()}
                        <span className="text-lg text-gray-300 mx-2">({formatTime(bestScore.time)})</span>
                    </div>
                    :
                    <div className="text-xl font-bold text-gray-200">No scores yet!</div>
                }
            </div>

            <button
                onClick={() => setIsFlagging(!isFlagging)}
                className={`w-full py-2 px-4 rounded-md text-gray-900 font-semibold transition-all duration-300 mt-2 ${
                    isFlagging
                        ? 'bg-red-400 hover:bg-red-500'
                        : 'bg-blue-400 hover:bg-blue-500'
                }`}
            >
                {isFlagging ? 'Disable Flagging' : 'Enable Flagging'}
            </button>

            <div className="flex justify-center my-3">
                <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <button onClick={() => handleMove(0, -2)}
                            className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                        <ChevronUp className="w-6 h-6 text-yellow-400"/>
                    </button>
                    <div></div>
                    <button onClick={() => handleMove(-2, 0)}
                            className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-yellow-400"/>
                    </button>
                    <div className="w-10 h-10"></div>
                    <button onClick={() => handleMove(2, 0)}
                            className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                        <ChevronRight className="w-6 h-6 text-yellow-400"/>
                    </button>
                    <div></div>
                    <button onClick={() => handleMove(0, 2)}
                            className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                        <ChevronDown className="w-6 h-6 text-yellow-400"/>
                    </button>
                    <div></div>
                </div>
            </div>

            <div className="inline-block border-2 border-gray-500">
                {[...Array(viewSize)].map((_, row) => (
                    <div key={row} className="flex">
                        {[...Array(viewSize)].map((_, col) => {
                            const x = viewport.x + col;
                            const y = viewport.y + row;
                            const cell = grid.get(getCellKey(x, y)) || {revealed: false, value: 0, flagged: false};

                            return (
                                <div
                                    key={`${row}-${col}`}
                                    className={`w-8 h-8 border border-gray-500 bg-gray-200 ${
                                        cell.revealed
                                            ? cell.value === "bomb"
                                                ? "bg-red-400"
                                                : "bg-gray-400"
                                            : "hover:bg-gray-300"
                                    }`}
                                    onClick={() => handleClick(x, y)}
                                    onContextMenu={(e) => handleFlag(e, x, y)}
                                >
                                    {cell.revealed && cell.value === "bomb" && (
                                        <p className="select-none text-lg font-semibold flex justify-center items-center h-full">
                                            <Bomb className="w-5 h-5 text-red-900" />
                                        </p>
                                    )}
                                    {cell.revealed && cell.value !== 0 && cell.value !== "bomb" && (
                                        <p className={`select-none text-center text-2xl font-bold ${getNumberColor(cell.value)}`}>
                                            {cell.value}
                                        </p>
                                    )}
                                    {cell.flagged && !cell.revealed && (
                                        <p className="select-none text-lg font-semibold flex items-center justify-center h-full">
                                            <Flag className="w-6 h-6 text-red-600" />
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
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

export default Grid