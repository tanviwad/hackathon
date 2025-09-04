export interface JournalEntry {
  id: string
  createdAt: string
  content: string
  mood?: 'very-bad' | 'bad' | 'neutral' | 'good' | 'great'
  tags?: string[]
}

export interface JournalState {
  entries: JournalEntry[]
}


