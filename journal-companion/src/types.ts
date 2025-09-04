export interface JournalEntry {
  id: string
  createdAt: string
  content: string
  mood?: 'very-bad' | 'bad' | 'neutral' | 'good' | 'great' | 'anxious' | 'peaceful'
  tags?: string[]
  sentiment?: number
  themes?: string[]
}

export interface JournalState {
  entries: JournalEntry[]
}

export interface Theme {
  term: string
  count: number
  sentiment: number
}