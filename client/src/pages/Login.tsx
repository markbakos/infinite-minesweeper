import { motion, type Variants } from "framer-motion"
import {Lock, ChevronRight, User} from "lucide-react"
import {Link, useNavigate} from "react-router-dom"
import {useState} from "react";
import axios from "axios";
import {Header} from "../components/Header.tsx";

export const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (loading) return

        setLoading(true)
        setError("")

        try {
            const response = await axios.post("https://infinite-minesweeper-backend.onrender.com/api/auth/login", {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.data.token) {
                localStorage.setItem("token", response.data.token)
                navigate("/")
            } else {
            setError("No token returned from server")
            }
        }
        catch (e) {
            setError("Something went wrong")
        }
        setLoading(false)

    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
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

    const buttonVariants: Variants = {
        initial: { scale: 1, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)" },
        hover: {
            scale: 1.05,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            transition: { type: "inertia", stiffness: 400, damping: 10 },
        },
    }

    const iconVariants: Variants = {
        initial: { x: 0 },
        hover: {
            x: 5,
            transition: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 0.6,
            },
        },
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-gray-500 to-gray-700 min-h-screen w-screen flex flex-col justify-center items-center p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Header />
            <motion.h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 text-center" variants={itemVariants}>
                Login
            </motion.h1>

            <motion.div className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-xl" variants={itemVariants}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="username" className="block text-gray-300 text-sm font-medium">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="username"
                                required
                                className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Your username"
                                value={username}
                                onChange={(e) => {setUsername(e.target.value)}}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                            <label htmlFor="password" className="block text-gray-300 text-sm font-medium">
                                Password
                            </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}}
                            />
                        </div>
                    </motion.div>

                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                    <motion.button
                        type="submit"
                        className="w-full py-3 px-6 bg-white rounded-lg text-purple-700 font-semibold text-lg flex items-center justify-between group"
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        disabled={loading}
                    >
                        <span>Log In</span>
                        <motion.div variants={iconVariants}>
                            <ChevronRight />
                        </motion.div>
                    </motion.button>
                </form>

                <motion.div className="mt-6 text-center" variants={itemVariants}>
                    <p className="text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}