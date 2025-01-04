export type Cell = {
    revealed: boolean
    value: number | 'bomb'
    flagged: boolean
}