import { useEffect, useState } from "react"
import { motion, Variants } from "framer-motion"
import axios from "axios"
import { Trophy, Medal, User, Ghost, CalendarIcon } from "lucide-react"
import {Header} from "../components/Header.tsx";

interface LeaderboardEntry {
    id: string
    game_type: string
    score: number
    time_in_seconds: number
    played_at: string
    user_id: string
    username: string
    is_guest: boolean
}

interface LeaderboardResponse {
    game_type: string
    leaderboard: LeaderboardEntry[]
    total: number
}

export const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getDaysSince = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays >= 100 ? '99+' : diffDays
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    }

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get<LeaderboardResponse>("http://localhost:8080/api/leaderboard?gameType=infinite&limit=10&skip=0")
                setLeaderboardData(response.data.leaderboard)
                setError("")
            } catch (e) {
                setError("Something went wrong")
            }
            setLoading(false)
        }

        fetchLeaderboard()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-700 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-12 bg-gray-800 rounded w-1/3"></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-800 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-700 pt-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Header />
            <div className="max-w-4xl mx-auto">
                <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
                    <Trophy className="w-10 h-10 text-yellow-400" />
                    <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
                </motion.div>

                {error && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-red-600 text-white p-4 rounded-lg mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="space-y-4">
                    {leaderboardData.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            variants={itemVariants}
                            className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 text-2xl font-bold text-gray-400">
                                        {index + 1}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {entry.is_guest ? (
                                            <Ghost className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <User className="w-5 h-5 text-blue-400" />
                                        )}
                                        <span className="text-white font-medium">
                                            {entry.username}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Medal className="w-5 h-5 text-yellow-400" />
                                        <span className="text-white font-bold">
                                            {entry.score}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm gap-2 relative">
                                        <CalendarIcon className="w-5 h-5 mr-1"/>
                                        {formatDate(entry.played_at)}
                                        <div
                                            className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center select-none">
                                            {getDaysSince(entry.played_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}