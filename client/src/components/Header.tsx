import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Link } from "react-router-dom"
import { LogOut, User } from "lucide-react"

interface UserData {
    id: string
    username: string
}

export const Header = () => {

    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        const token = localStorage.getItem("token")

        setLoading(true)

        if (!token) {
            setUser(null)
            setLoading(false)
        }

        try {
            const response = await axios.get("https://infinite-minesweeper-backend.onrender.com/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(response.data)
        }
        catch (e) {
            localStorage.removeItem("token")
            setUser(null)
        }
        setLoading(false)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    if (loading) return (
        <div className="bg-gray-700 p-4 shadow-md fixed top-0 w-full z-20 mb-4">
            <div className="max-w-7xl mx-auto flex justify-end">
                <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
            </div>
        </div>
    )

    return (
        <motion.header
            className="bg-gray-700 p-4 shadow-md fixed top-0 w-full z-20 mb-4"
            initial={{y: -100}}
            animate={{y: 0}}
            transition={{type: "spring", stiffness: 300, damping: 30}}
        >
            <div className=" mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold px-7">
                    Minesweeper
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <motion.div
                                className="flex items-center gap-2 text-gray-300"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                            >
                                <User className="h-5 w-5"/>
                                <span>{user.username}</span>
                            </motion.div>
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                onClick={handleLogout}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <LogOut className="h-5 w-5"/>
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <div className="space-x-4">
                            <Link
                                to="/login"
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-white text-blue-800 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    )
}