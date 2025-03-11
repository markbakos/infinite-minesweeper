import axios from "axios";

interface GameRecord {
    game_type: 'normal' | 'infinite'
    score: number
    time_in_seconds: number
    played_at: string
}

interface GameRecordResponse {
    records: GameRecord[] | null
}

interface GameResults {
    infinite: {
        score: number | null
        time: number | null
    }
    normal: {
        score: number | null
        time: number | null
    }
}

export const fetchScores = async () => {
    const token = localStorage.getItem('token')

    if (!token) return null

    try {
        const response = await axios.get<GameRecordResponse>('https://infinite-minesweeper-backend.onrender.com/api/game/records', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.data.records) {
            return {
                infinite: { score: null, time: null },
                normal: { score: null, time: null }
            }
        }

        const records = response.data.records
        const result: GameResults = {
            infinite: { score: null, time: null },
            normal: { score: null, time: null }
        }

        records.forEach(record => {
            if (record.game_type === 'infinite') {
                result.infinite = {
                    score: record.score,
                    time: record.time_in_seconds
                }
            } else {
                result.normal = {
                    score: record.score,
                    time: record.time_in_seconds
                }
            }
        })

        return result
    }
    catch (e) {
        console.log(e)
        return null
    }
}

export const updateGameRecord = async (gameType: 'normal' | 'infinite', score: number | null, time: number) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
        const response = await axios.post('https://infinite-minesweeper-backend.onrender.com/api/game/record', {
            game_type: gameType,
            score: score || 0,
            time_in_seconds: time
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }
}