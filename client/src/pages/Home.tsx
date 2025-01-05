import { motion, Variants } from 'framer-motion'
import {Bomb, Grid, ChevronRight} from 'lucide-react'
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Score} from "../types.ts";

export const Home = () => {

    const [bestScoreInfinite, setBestScoreInfinite] = useState<Score>({score: null, time: null})

    useEffect(() => {
        const score = localStorage.getItem("bestScore_infinite")
        const time = localStorage.getItem("bestScoreTime_infinite")

        if (score !== null && time !== null){
            setBestScoreInfinite({
                score: parseInt(score),
                time: parseInt(time)})
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

    const buttonVariants: Variants = {
        initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)' },
        hover: {
            scale: 1.05,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
            transition: { type: 'spring', stiffness: 400, damping: 10 }
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
            <motion.h1
                className="text-6xl font-bold text-white mb-8 text-center"
                variants={itemVariants}
            >
                Minesweeper
            </motion.h1>

            <motion.div
                className="flex flex-col space-y-4 w-full max-w-md"
                variants={itemVariants}
            >
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-gray-400 text-2xl font-semibold">Best Score (Infinite):</h1>
                    {(bestScoreInfinite.score !== null && bestScoreInfinite.time !== null) ?
                        <div className="text-2xl font-bold text-gray-200">
                            {bestScoreInfinite.score.toLocaleString()}
                            <span className="text-lg text-gray-300 mx-2">({formatTime(bestScoreInfinite.time)})</span>
                        </div>
                        :
                        <div className="text-xl font-bold text-gray-200">No scores yet!</div>
                    }
                </motion.div>
                <Link to="/infinite">

                    <motion.button
                        className="w-full py-3 px-6 bg-white rounded-lg text-cyan-600 font-semibold text-lg flex items-center justify-between group"
                        variants={buttonVariants}
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

                <motion.button
                    className="w-full py-3 px-6 bg-white rounded-lg text-purple-700 font-semibold text-lg flex items-center justify-between group"
                    variants={buttonVariants}
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
            </motion.div>
        </motion.div>
    )
}

