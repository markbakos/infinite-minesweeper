import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '../components/Header'

interface TutorialSlide {
    image: string
    title: string
    description: string
}

const tutorialSlides: TutorialSlide[] = [
    {
        image: 'https://www.wikihow.com/images/thumb/0/00/Play-Minesweeper-Step-16.jpg/aid20186-v4-728px-Play-Minesweeper-Step-16.jpg.webp',
        title: 'Basic Controls',
        description: 'Click any square on the grid. Doing so will start the Minesweeper game.'
    },
    {
        image: 'https://www.wikihow.com/images/thumb/9/97/Play-Minesweeper-Step-17.jpg/aid20186-v4-728px-Play-Minesweeper-Step-17.jpg.webp',
        title: 'Flagging',
        description: 'Right-click any squares that you think contain mines.'
    },
    {
        image: 'https://www.wikihow.com/images/thumb/1/1f/Minesweeper-board-cleared.png/728px-Minesweeper-board-cleared.png.webp',
        title: 'Clear the board.',
        description: 'Clear the board. To win a round of Minesweeper, you must click on the board every square that doesn\'t have a mine under it. Once you\'ve done so, the game will be over.'
    },
]

export const Tutorial = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)

    useEffect(() => {
        let timer: number

        if (autoPlay) {
            timer = setInterval(() => {
                setCurrentSlide((prev) => prev === tutorialSlides.length - 1 ? 0 : prev + 1)
            }, 5000)
        }

        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, [autoPlay, tutorialSlides.length])

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-700 pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Header />
            <div className="max-w-4xl mx-auto px-4">
                <div className="relative overflow-hidden rounded-xl bg-gray-800 p-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col items-center"
                        >
                            <img
                                src={tutorialSlides[currentSlide].image}
                                alt={tutorialSlides[currentSlide].title}
                                className="rounded-lg max-h-[400px] object-contain"
                            />
                            <h2 className="text-2xl font-bold text-white mt-4">
                                {tutorialSlides[currentSlide].title}
                            </h2>
                            <p className="text-gray-300 mt-2 mb-4">
                                {tutorialSlides[currentSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <button
                            onClick={() => {
                                setCurrentSlide(prev =>
                                    prev === 0 ? tutorialSlides.length - 1 : prev - 1
                                )
                                setAutoPlay(false)
                            }}
                            className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                        >
                            <ChevronLeft />
                        </button>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            onClick={() => {
                                setCurrentSlide(prev =>
                                    prev === tutorialSlides.length - 1 ? 0 : prev + 1
                                )
                                setAutoPlay(false)
                            }}
                            className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                        >
                            <ChevronRight />
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {tutorialSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentSlide(index)
                                    setAutoPlay(false)
                                }}
                                className={`h-2 w-2 rounded-full ${
                                    currentSlide === index ? 'bg-white' : 'bg-gray-500'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}