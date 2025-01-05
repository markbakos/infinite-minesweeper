export type Cell = {
    revealed: boolean
    value: number | 'bomb'
    flagged: boolean
}

export type Score = {
    score: number | null
    time: number | null
}