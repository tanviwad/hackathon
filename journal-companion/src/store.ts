// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import type { JournalEntry, JournalState } from './types'

// interface Actions {
//   addEntry: (content: string, mood?: JournalEntry['mood'], tags?: string[]) => void
//   updateEntry: (id: string, updates: Partial<JournalEntry>) => void
//   deleteEntry: (id: string) => void
//   clearAll: () => void
// }

// export const useJournal = create<JournalState & Actions>()(
//   persist(
//     (set) => ({
//       entries: [],
//       addEntry: (content, mood, tags) =>
//         set((s) => ({
//           entries: [
//             { id: crypto.randomUUID(), createdAt: new Date().toISOString(), content, mood, tags },
//             ...s.entries,
//           ],
//         })),
//       updateEntry: (id, updates) =>
//         set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),
//       deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
//       clearAll: () => set({ entries: [] }),
//     }),
//     { name: 'journal-companion' },
//   ),
// )


