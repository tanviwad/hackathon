// File: src/components/ClarityTracking.tsx
import React, { useState, useMemo } from 'react'
import { Brain, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { JournalEntry } from '../types'
import { measureClarity } from '../utils/clarityTracking'

interface ClarityTrackingProps {
  entries: JournalEntry[]
}

export function ClarityVisualization({ entries }: ClarityTrackingProps) {
  const clarityData = useMemo(() => {
    return entries.slice(0, 10).map((entry, index) => {
      const metrics = measureClarity(entry)
      return {
        entry: index + 1,
        date: new Date(entry.createdAt).toLocaleDateString(),
        improvement: metrics.improvement,
        beforeScore: (metrics.beforeWriting.confusion + metrics.beforeWriting.stress + metrics.beforeWriting.uncertainty) / 3,
        afterScore: (metrics.afterWriting.clarity + metrics.afterWriting.resolution + metrics.afterWriting.peace) / 3
      }
    }).reverse()
  }, [entries])

  const avgImprovement = clarityData.length > 0 
    ? clarityData.reduce((sum, data) => sum + data.improvement, 0) / clarityData.length 
    : 0

  if (entries.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-pink-500" />
        Clarity Impact
      </h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Average Clarity Gain</span>
          <span className={`text-lg font-bold ${avgImprovement > 0 ? 'text-green-600' : 'text-gray-600'}`}>
            {avgImprovement > 0 ? '+' : ''}{avgImprovement.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max((avgImprovement + 2) / 4 * 100, 0), 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {avgImprovement > 1 ? 'Significant clarity gains!' : 
           avgImprovement > 0 ? 'Consistent clarity improvement' : 
           'Building your clarity practice'}
        </p>
      </div>

      {clarityData.length > 0 && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={clarityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="entry" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'improvement' ? `${value > 0 ? '+' : ''}${value.toFixed(1)}` : value.toFixed(1),
                  name === 'improvement' ? 'Clarity Gain' : name === 'beforeScore' ? 'Before Writing' : 'After Writing'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.date
                  }
                  return `Entry ${label}`
                }}
              />
              <Line type="monotone" dataKey="improvement" stroke="#ec4899" strokeWidth={2} name="improvement" />
              <Line type="monotone" dataKey="beforeScore" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" name="beforeScore" />
              <Line type="monotone" dataKey="afterScore" stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" name="afterScore" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Your Clarity Journey</h4>
        <p className="text-sm text-gray-700">
          {avgImprovement > 1 
            ? "Journaling is clearly helping you process thoughts and gain clarity. You're experiencing significant mental clarity gains through writing!"
            : avgImprovement > 0 
            ? "You're seeing consistent clarity improvements through journaling. Each entry helps you think through challenges more effectively."
            : "You're building a valuable clarity practice. Keep writing - the mental clarity benefits often compound over time."
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

  if (!showAfter) {
    return (
      <div className="bg-white-50 border border-pink-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium mb-3">Quick Clarity Check</h4>
        <p className="text-sm text-gray-700 mb-3">Before you start writing, how clear do you feel about your thoughts and feelings?</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">Confused</span>
          <input
            type="range"
            min="1"
            max="5"
            value={beforeClarity}
            color="pink"
            onChange={(e) => setBeforeClarity(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm">Very Clear</span>
        </div>
        
        <button
          onClick={handleBeforeSubmit}
          className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Start Writing ({beforeClarity}/5)
        </button>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h4 className="font-medium mb-3">After Writing Check</h4>
      <p className="text-sm text-gray-700 mb-3">How clear do you feel now after writing?</p>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">Still Confused</span>
        <input
          type="range"
          min="1"
          max="5"
          value={afterClarity}
          onChange={(e) => setAfterClarity(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm">Very Clear</span>
      </div>
      
      <div className="mb-3 p-2 bg-white rounded text-center">
        <span className="text-sm text-gray-600">Clarity gain: </span>
        <span className={`font-bold ${afterClarity > beforeClarity ? 'text-green-600' : 'text-gray-600'}`}>
          {afterClarity > beforeClarity ? '+' : ''}{afterClarity - beforeClarity}
        </span>
      </div>
      
      <button
        onClick={handleAfterSubmit}
        className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-green-600"
      >
        Complete Clarity Check ({afterClarity}/5)
      </button>
    </div>
  )
}