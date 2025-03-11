import { motion, Variants } from 'framer-motion'
import {Bomb, Grid, ChevronRight} from 'lucide-react'
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {Score} from "../types.ts";
import {Header} from "../components/Header.tsx";

export const Home = () => {

    const [bestScoreInfinite, setBestScoreInfinite] = useState<Score>({score: null, time: null})
    const [bestScoreNormal, setBestScoreNormal] = useState<Score>({score: null, time: null})

    useEffect(() => {
        const scoreInf = localStorage.getItem("bestScore_infinite")
        const timeInf = localStorage.getItem("bestScoreTime_infinite")

        if (scoreInf !== null && timeInf !== null){
            setBestScoreInfinite({
                score: parseInt(scoreInf),
                time: parseInt(timeInf)})
        }

        const timeNorm = localStorage.getItem("bestScoreTime_normal")

        if (timeNorm !== null){
            setBestScoreNormal({
                score: null,
                time: parseInt(timeNorm)})
        }
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    }

    const iconVariants: Variants = {
        initial: { x: 0 },
        hover: {
            x: 5,
            transition: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 0.6
            }
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000)
        const seconds = Math.floor((time % 60000) / 1000)
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-gray-500 to-gray-700 min-h-screen w-screen flex flex-col justify-center items-center p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Header />
            <motion.h1
                className="text-5xl sm:text-6xl font-bold text-white mb-8 text-center"
                variants={itemVariants}
            >
                Minesweeper
            </motion.h1>

            <motion.div
                className="flex flex-col space-y-4 w-full max-w-md"
                variants={itemVariants}
            >
                <div className="flex flex-col sm:flex-row justify-between my-2 space-y-3 sm:space-y-0">
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-gray-400 text-2xl font-semibold">Infinite</h1>
                        <h1 className="text-gray-400 text-2xl font-semibold">Best Score:</h1>
                        {(bestScoreInfinite.score !== null && bestScoreInfinite.time !== null) ?
                            <div className="text-2xl font-bold text-gray-200">
                                {bestScoreInfinite.score.toLocaleString()}
                                <span
                                    className="text-lg text-gray-300 mx-2">({formatTime(bestScoreInfinite.time)})</span>
                            </div>
                            :
                            <div className="text-2xl font-bold text-gray-200">No scores yet!</div>
                        }
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-gray-400 text-2xl font-semibold">Normal</h1>
                        <h1 className="text-gray-400 text-2xl font-semibold">Best Time:</h1>
                        {(bestScoreNormal.time !== null) ?
                            <div className="text-2xl font-bold text-gray-200">
                                {formatTime(bestScoreNormal.time)}
                            </div>
                            :
                            <div className="text-2xl font-bold text-gray-200">No scores yet!</div>
                        }
                    </motion.div>
                </div>


                <Link to="/infinite">
                    <motion.button
                        className="w-full py-3 px-6 bg-white rounded-lg text-cyan-600 font-semibold text-lg flex items-center justify-between group"
                        initial="initial"
                        whileHover="hover"
                    >
                        <div className="flex items-center">
                            <Grid className="mr-2"/>
                            Infinite Minesweeper
                        </div>
                        <motion.div variants={iconVariants}>
                            <ChevronRight/>
                        </motion.div>
                    </motion.button>
                </Link>
                <Link to="/normal">
                    <motion.button
                        className="w-full py-3 px-6 bg-white rounded-lg text-purple-700 font-semibold text-lg flex items-center justify-between group"
                        initial="initial"
                        whileHover="hover"
                    >
                        <div className="flex items-center">
                            <Bomb className="mr-2"/>
                            Normal Minesweeper
                        </div>
                        <motion.div variants={iconVariants}>
                            <ChevronRight/>
                        </motion.div>
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    )
}

