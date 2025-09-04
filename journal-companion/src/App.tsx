import { useState } from 'react'
import { Send } from 'lucide-react'
import { useJournal } from './store'
import type { JournalEntry } from './types'
import Insights from './components/Insights'

function App() {
  const { entries, addEntry, deleteEntry } = useJournal()
  const [inputValue, setInputValue] = useState('')
  const [mood, setMood] = useState<JournalEntry['mood']>()

  const save = () => {
    if (inputValue.trim()) {
      addEntry(inputValue.trim(), mood)
      setInputValue('')
      setMood(undefined)
    }
  }
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">AI Journaling Companion</h1>
        <p className="mt-1 text-sm text-gray-600">A warm space to reflect. Press ⌘/Ctrl+Enter to save.</p>
      </header>
      <section className="rounded-xl border border-rose-100 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Mood</span>
          {[
            { k: 'very-bad', label: 'Tough', emoji: '😞' },
            { k: 'bad', label: 'Low', emoji: '🙁' },
            { k: 'neutral', label: 'Okay', emoji: '😐' },
            { k: 'good', label: 'Good', emoji: '🙂' },
            { k: 'great', label: 'Great', emoji: '😊' },
          ].map((m) => (
            <button
              key={m.k}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                mood === (m.k as JournalEntry['mood'])
                  ? 'border-pink-300 bg-pink-50 text-pink-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setMood(m.k as JournalEntry['mood'])}
            >
              <span className="mr-1">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          rows={6}
          placeholder="What felt meaningful today? Any small wins or worries you'd like to unpack?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault()
              save()
            }
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Tip: ⌘/Ctrl+Enter to save instantly</p>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-amber-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-300"
            onClick={save}
          >
            <Send className="h-4 w-4" />
            Save Entry
          </button>
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Recent Entries</h2>
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 hover:border-pink-200">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString()}</div>
                {e.mood && (
                  <div className="text-xs text-pink-700">
                    {e.mood === 'very-bad' && '😞 Tough'}
                    {e.mood === 'bad' && '🙁 Low'}
                    {e.mood === 'neutral' && '😐 Okay'}
                    {e.mood === 'good' && '🙂 Good'}
                    {e.mood === 'great' && '😊 Great'}
                  </div>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-900">{e.content}</div>
              <div className="mt-2 text-right">
                <button className="text-xs text-danger hover:underline" onClick={() => deleteEntry(e.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
          {entries.length === 0 && <div className="text-sm text-gray-500">No entries yet.</div>}
        </ul>
      </section>
      <Insights />
    </div>
  )
}

export default App
