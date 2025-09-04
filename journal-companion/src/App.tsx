import React, { useState, useMemo } from 'react'
import { Send, TrendingUp, Brain, Calendar, Lightbulb, Heart, BarChart3, Sparkles } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useJournal } from './store'
import type { JournalEntry } from './types'
import { analyzeSentiment, extractThemes, generateDynamicPrompts, generateWeeklyInsights } from './utils/nlp'

export default function App() {
  const { entries, addEntry, deleteEntry } = useJournal()
  const [inputValue, setInputValue] = useState('')
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>()
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)

  const moods = [
    { key: 'very-bad' as const, label: 'Struggling', emoji: '😞', color: 'red' },
    { key: 'bad' as const, label: 'Tough', emoji: '🙁', color: 'orange' },
    { key: 'neutral' as const, label: 'Okay', emoji: '😐', color: 'gray' },
    { key: 'good' as const, label: 'Good', emoji: '🙂', color: 'green' },
    { key: 'great' as const, label: 'Great', emoji: '😊', color: 'emerald' },
  ]

  const dynamicPrompts = useMemo(() => generateDynamicPrompts(entries), [entries])
  const themes = useMemo(() => extractThemes(entries), [entries])
  const weeklyInsights = useMemo(() => generateWeeklyInsights(entries), [entries])

  // Sentiment analysis data for chart
  const sentimentData = useMemo(() => {
    if (entries.length === 0) return []
    
    // Get the most recent 14 entries and create stable chart data
    const recentEntries = entries.slice(0, 14)
    
    return recentEntries
      .map((entry, index) => ({
        day: `Day ${index + 1}`,
        sentiment: analyzeSentiment(entry.content),
        date: new Date(entry.createdAt).toLocaleDateString(),
        entryId: entry.id
      }))
      .reverse() // Reverse so oldest is on left, newest on right
  }, [
    entries.length, 
    entries.slice(0, 14).map(e => `${e.id}-${e.content.slice(0, 50)}`).join('|')
  ]) // Only recalculate when entries actually change content

  const saveEntry = () => {
    if (inputValue.trim()) {
      addEntry(inputValue.trim(), selectedMood)
      setInputValue('')
      setSelectedMood(undefined)
    }
  }

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % dynamicPrompts.length)
  }

  const currentPrompt = dynamicPrompts[currentPromptIndex] || "What's on your mind today?"

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="mx-auto max-w-6xl p-6 space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              AI Journaling Companion
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your private, empathetic companion for meaningful self-reflection and personal growth
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Writing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dynamic Prompt */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-pink-500" />
                  <h3 className="font-medium text-gray-900">Today's Reflection Prompt</h3>
                </div>
                <button
                  onClick={nextPrompt}
                  className="text-pink-500 hover:text-pink-700 text-sm font-medium"
                >
                  Next →
                </button>
              </div>
              <p className="text-gray-700 italic bg-pink-50 p-4 rounded-lg">
                {currentPrompt}
              </p>
            </div>

            {/* Writing Interface */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-6">
              {/* Mood Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Heart className="h-4 w-4" />
                  How are you feeling?
                </label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.key}
                      onClick={() => setSelectedMood(mood.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        selectedMood === mood.key
                          ? 'border-pink-300 bg-pink-50 text-pink-700 ring-2 ring-pink-200'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{mood.emoji}</span>
                      <span className="text-sm">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-3">
                <textarea
                  className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 text-gray-900 placeholder-gray-500"
                  placeholder="Start writing your thoughts... There's no judgment here, just space for you to be authentic."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault()
                      saveEntry()
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Press Cmd/Ctrl + Enter to save quickly
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {inputValue.length} characters
                    </span>
                    <button
                      onClick={saveEntry}
                      disabled={!inputValue.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      Save Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-pink-500" />
                Recent Entries
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-3">
                        {entry.mood && (
                          <span className="text-sm">
                            {moods.find(m => m.key === entry.mood)?.emoji} {moods.find(m => m.key === entry.mood)?.label}
                          </span>
                        )}
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                ))}
                {entries.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No entries yet. Start by sharing what's on your mind!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Insights Sidebar */}
          <div className="space-y-6">
            {/* Weekly Insights */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-pink-500" />
                Weekly Insights
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {weeklyInsights}
              </p>
            </div>

            {/* Sentiment Trend */}
            {sentimentData.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  Emotional Journey
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sentimentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [
                          value > 0 ? 'Positive' : value < 0 ? 'Challenging' : 'Neutral',
                          'Mood'
                        ]}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            return payload[0].payload.date
                          }
                          return label
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sentiment" 
                        stroke="#ec4899" 
                        strokeWidth={2}
                        dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Themes */}
            {themes.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-pink-500" />
                  Key Themes
                </h3>
                <div className="space-y-3">
                  {themes.slice(0, 6).map((theme) => (
                    <div key={theme.term} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {theme.term}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div 
                            className="h-2 w-8 rounded-full"
                            style={{
                              background: theme.sentiment > 0 
                                ? 'linear-gradient(to right, #fce7f3, #ec4899)' 
                                : theme.sentiment < 0 
                                ? 'linear-gradient(to right, #fef2f2, #ef4444)'
                                : 'linear-gradient(to right, #f3f4f6, #6b7280)'
                            }}
                          />
                          <span className="text-xs text-gray-500">{theme.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Encouragement */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">Keep Going!</h3>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                {entries.length === 0 
                  ? "Every journey begins with a single step. Share what's in your heart today."
                  : `You've written ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}! Each reflection is a gift to your future self.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}