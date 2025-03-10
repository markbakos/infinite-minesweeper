import {motion, type Variants} from "framer-motion"
import {ChevronRight, Lock, User} from "lucide-react"
import {Link} from "react-router-dom"
import {useState} from "react"
import axios from "axios";


export const SignUp = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (loading) return

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        
        setLoading(true)
        setError("")

        try {
            await axios.post("http://localhost:8080/api/auth/register", {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
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
            <motion.h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 text-center" variants={itemVariants}>
                Sign Up
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
                                type="text"
                                required
                                className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                                className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => {setConfirmPassword(e.target.value)}}
                            />
                        </div>
                    </motion.div>

                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}


                    <motion.button
                        type="submit"
                        className="w-full py-3 px-6 bg-white rounded-lg text-blue-800 font-semibold text-lg flex items-center justify-between group"
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        disabled={loading}
                    >
                        <span>{loading ? "Creating Account" :  "Create Account"}</span>
                        <motion.div variants={iconVariants}>
                            <ChevronRight />
                        </motion.div>
                    </motion.button>
                </form>

                <motion.div className="mt-6 text-center" variants={itemVariants}>
                    <p className="text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Log in
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
