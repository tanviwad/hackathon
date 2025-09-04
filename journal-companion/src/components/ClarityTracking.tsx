// File: src/components/ClarityTracking.tsx
import React, { useState, useMemo } from 'react'
import { Brain, TrendingUp, Sparkles, Heart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import type { JournalEntry } from '../types'
import { measureClarity } from '../utils/clarityTracking'

interface ClarityTrackingProps {
  entries: JournalEntry[]
}

export function ClarityVisualization({ entries }: ClarityTrackingProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'trend'>('daily')
  
  const clarityData = useMemo(() => {
    if (entries.length === 0) return []
    
    // Group entries by day and calculate daily clarity metrics
    const dailyData = new Map<string, { entries: JournalEntry[], metrics: any[] }>()
    
    entries.slice(0, 21).forEach(entry => {
      const dateKey = new Date(entry.createdAt).toLocaleDateString()
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, { entries: [], metrics: [] })
      }
      const dayData = dailyData.get(dateKey)!
      dayData.entries.push(entry)
      dayData.metrics.push(measureClarity(entry))
    })
    
    // Convert to chart data
    return Array.from(dailyData.entries())
      .map(([date, data]) => {
        const avgImprovement = data.metrics.reduce((sum, m) => sum + m.improvement, 0) / data.metrics.length
        const avgBefore = data.metrics.reduce((sum, m) => 
          sum + (m.beforeWriting.confusion + m.beforeWriting.stress + m.beforeWriting.uncertainty) / 3, 0
        ) / data.metrics.length
        const avgAfter = data.metrics.reduce((sum, m) => 
          sum + (m.afterWriting.clarity + m.afterWriting.resolution + m.afterWriting.peace) / 3, 0
        ) / data.metrics.length
        
        return {
          date,
          dateObj: new Date(data.entries[0].createdAt),
          improvement: avgImprovement,
          beforeScore: avgBefore,
          afterScore: avgAfter,
          entryCount: data.entries.length,
          clarityGain: Math.max(0, avgImprovement)
        }
      })
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
      .slice(-14) // Last 14 days
  }, [entries])

  const totalClarityGain = clarityData.reduce((sum, day) => sum + Math.max(0, day.improvement), 0)
  const avgImprovement = clarityData.length > 0 
    ? clarityData.reduce((sum, data) => sum + data.improvement, 0) / clarityData.length 
    : 0
  const bestDay = clarityData.reduce((best, day) => 
    day.improvement > (best?.improvement || -Infinity) ? day : best, null as any)

  if (entries.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-pink-500" />
          Daily Clarity Tracking
        </h3>
        <div className="flex bg-pink-50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'daily' 
                ? 'bg-pink-500 text-white' 
                : 'text-pink-600 hover:bg-pink-100'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('trend')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'trend' 
                ? 'bg-pink-500 text-white' 
                : 'text-pink-600 hover:bg-pink-100'
            }`}
          >
            Trend
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-pink-600">{clarityData.length}</div>
          <div className="text-xs text-gray-600">Days Tracked</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-600">+{totalClarityGain.toFixed(1)}</div>
          <div className="text-xs text-gray-600">Total Clarity Gain</div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-orange-600">
            {avgImprovement > 0 ? '+' : ''}{avgImprovement.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Avg Daily Gain</div>
        </div>
      </div>

      {/* Best Day Highlight */}
      {bestDay && bestDay.improvement > 0.5 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Your Best Clarity Day</span>
          </div>
          <p className="text-sm opacity-90">
            {bestDay.date} - You gained +{bestDay.improvement.toFixed(1)} clarity points! 
            {bestDay.entryCount > 1 ? `Across ${bestDay.entryCount} entries` : 'Great self-reflection'}
          </p>
        </div>
      )}

      {/* Visualization */}
      {clarityData.length > 0 && (
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'daily' ? (
              <BarChart data={clarityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value > 0 ? '+' : ''}${value.toFixed(1)}`,
                    'Clarity Gain'
                  ]}
                  labelFormatter={(date) => `${date} (${clarityData.find(d => d.date === date)?.entryCount} ${clarityData.find(d => d.date === date)?.entryCount === 1 ? 'entry' : 'entries'})`}
                  contentStyle={{
                    backgroundColor: '#fdf2f8',
                    border: '1px solid #fbcfe8',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="clarityGain" 
                  fill="url(#pinkGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart data={clarityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'improvement' ? `${value > 0 ? '+' : ''}${value.toFixed(1)}` : value.toFixed(1),
                    name === 'improvement' ? 'Clarity Gain' : name === 'beforeScore' ? 'Before Writing' : 'After Writing'
                  ]}
                  labelFormatter={(date) => `${date}`}
                  contentStyle={{
                    backgroundColor: '#fdf2f8',
                    border: '1px solid #fbcfe8',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="improvement" stroke="#ec4899" strokeWidth={3} name="improvement" 
                      dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="beforeScore" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" name="beforeScore" />
                <Line type="monotone" dataKey="afterScore" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" name="afterScore" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights */}
      <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-pink-500" />
          <h4 className="font-medium text-gray-800">Your Clarity Journey</h4>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {avgImprovement > 1.5 
            ? `🌟 Incredible! You're gaining an average of +${avgImprovement.toFixed(1)} clarity points daily. Journaling is clearly transforming how you process thoughts and emotions.`
            : avgImprovement > 0.8 
            ? `✨ Excellent progress! With +${avgImprovement.toFixed(1)} average daily clarity gain, you're building a powerful self-reflection practice.`
            : avgImprovement > 0.3 
            ? `💫 You're seeing consistent clarity improvements (+${avgImprovement.toFixed(1)} daily average). Each entry helps you think through challenges more effectively.`
            : `🌱 You're building a valuable clarity practice. Keep writing - the mental clarity benefits often compound over time.`
          }
        </p>
      </div>
    </div>
  )
}

export function ClarityCheckIn({ onSubmit }: { onSubmit: (before: number, after: number) => void }) {
  const [beforeClarity, setBeforeClarity] = useState<number>(3)
  const [afterClarity, setAfterClarity] = useState<number>(3)
  const [showAfter, setShowAfter] = useState(false)

  const handleBeforeSubmit = () => {
    setShowAfter(true)
  }

  const handleAfterSubmit = () => {
    onSubmit(beforeClarity, afterClarity)
    setShowAfter(false)
    setBeforeClarity(3)
    setAfterClarity(3)
  }

  const getClarityEmoji = (value: number) => {
    if (value <= 1) return '🌫️'
    if (value <= 2) return '🤔'
    if (value <= 3) return '😐'
    if (value <= 4) return '💡'
    return '✨'
  }

  if (!showAfter) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-pink-500" />
          <h4 className="font-medium text-gray-800">Quick Clarity Check</h4>
        </div>
        <p className="text-sm text-gray-700 mb-4">Before you start writing, how clear do you feel about your thoughts and feelings?</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            <span className="text-3xl">{getClarityEmoji(beforeClarity)}</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-600 w-16">Foggy</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="1"
                max="5"
                value={beforeClarity}
                onChange={(e) => setBeforeClarity(Number(e.target.value))}
                className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider-pink"
                style={{
                  background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(beforeClarity - 1) * 25}%, #fce7f3 ${(beforeClarity - 1) * 25}%, #fce7f3 100%)`
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-16 text-right">Crystal Clear</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-pink-600">{beforeClarity}/5</span>
          </div>
        </div>
        
        <button
          onClick={handleBeforeSubmit}
          className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-md font-medium"
        >
          Start Writing Journey
        </button>
      </div>
    )
  }

  const clarityGain = afterClarity - beforeClarity
  
  return (
    <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border border-purple-200 rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h4 className="font-medium text-gray-800">After Writing Check</h4>
      </div>
      <p className="text-sm text-gray-700 mb-4">How clear do you feel now after writing?</p>
      
      <div className="mb-4">
        <div className="flex items-center justify-center mb-3">
          <span className="text-3xl">{getClarityEmoji(afterClarity)}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-gray-600 w-16">Still Foggy</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="1"
              max="5"
              value={afterClarity}
              onChange={(e) => setAfterClarity(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(afterClarity - 1) * 25}%, #f3e8ff ${(afterClarity - 1) * 25}%, #f3e8ff 100%)`
              }}
            />
          </div>
          <span className="text-sm text-gray-600 w-16 text-right">Perfectly Clear</span>
        </div>
        <div className="text-center">
          <span className="text-sm font-medium text-purple-600">{afterClarity}/5</span>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-white rounded-lg text-center border">
        <span className="text-sm text-gray-600">Clarity transformation: </span>
        <span className={`font-bold text-lg ${
          clarityGain > 0 ? 'text-green-600' : 
          clarityGain < 0 ? 'text-orange-600' : 'text-gray-600'
        }`}>
          {clarityGain > 0 ? '+' : ''}{clarityGain} point{Math.abs(clarityGain) !== 1 ? 's' : ''}
        </span>
        {clarityGain > 0 && <span className="ml-2">🎉</span>}
      </div>
      
      <button
        onClick={handleAfterSubmit}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md font-medium"
      >
        Complete Clarity Check ✨
      </button>
    </div>
  )
}
