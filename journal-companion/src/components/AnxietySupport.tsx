// File: src/components/AnxietySupport.tsx
import React, { useState } from 'react'
import { Heart, AlertCircle, CheckCircle } from 'lucide-react'
import type { AnxietyInsight } from '../utils/anxietyDetection'

interface AnxietySupportProps {
  insight: AnxietyInsight
}

export function AnxietySupportCard({ insight }: AnxietySupportProps) {
  const getLevelColor = (level: AnxietyInsight['level']) => {
    switch (level) {
      case 'mild': return 'border-yellow-200 bg-yellow-50'
      case 'moderate': return 'border-orange-200 bg-orange-50'  
      case 'high': return 'border-red-200 bg-red-50'
    }
  }

  const getLevelIcon = (level: AnxietyInsight['level']) => {
    switch (level) {
      case 'mild': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'moderate': return <AlertCircle className="h-5 w-5 text-orange-600" />
      case 'high': return <AlertCircle className="h-5 w-5 text-red-600" />
    }
  }

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${getLevelColor(insight.level)}`}>
      <div className="flex items-center gap-2 mb-4">
        {getLevelIcon(insight.level)}
        <h3 className="font-semibold text-gray-900">Anxiety Support</h3>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        I've noticed some anxiety patterns in your recent writing. Here's some gentle support:
      </p>

      {insight.triggers.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Common Triggers</h4>
          <div className="flex flex-wrap gap-2">
            {insight.triggers.map((trigger, index) => (
              <span key={index} className="px-2 py-1 bg-white rounded-full text-xs text-gray-700 border">
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Helpful Strategies</h4>
        <ul className="space-y-2">
          {insight.suggestions.map((suggestion, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {insight.breathingExercise && (
        <BreathingExercise />
      )}
    </div>
  )
}

export function BreathingExercise() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [count, setCount] = useState(4)
  const [cycle, setCycle] = useState(0)
  const [isActive, setIsActive] = useState(false)

  React.useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          if (phase === 'inhale') {
            setPhase('hold')
            return 4
          } else if (phase === 'hold') {
            setPhase('exhale')
            return 6
          } else {
            setPhase('inhale')
            setCycle(c => c + 1)
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase])

  React.useEffect(() => {
    if (cycle >= 4) {
      setIsActive(false)
    }
  }, [cycle])

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in slowly...'
      case 'hold': return 'Hold your breath...'
      case 'exhale': return 'Breathe out gently...'
    }
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-xl border">
      <h4 className="font-medium mb-3 text-center">Breathing Exercise</h4>
      
      <div className="text-center mb-4">
        <div className={`w-20 h-20 mx-auto rounded-full border-4 transition-all duration-1000 ${
          phase === 'inhale' ? 'scale-110 border-blue-400 bg-blue-100' :
          phase === 'hold' ? 'scale-110 border-purple-400 bg-purple-100' :
          'scale-90 border-green-400 bg-green-100'
        }`} />
      </div>

      <p className="text-center text-lg mb-2 text-gray-700">{getInstruction()}</p>
      <p className="text-center text-2xl font-bold mb-2 text-gray-800">{count}</p>
      <p className="text-center text-sm text-gray-600 mb-4">Cycle {cycle + 1} of 4</p>

      <button
        onClick={() => setIsActive(!isActive)}
        className={`w-full px-4 py-2 rounded-lg text-white transition-colors ${
          isActive ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isActive ? 'Pause' : cycle === 0 ? 'Start Breathing Exercise' : 'Continue'}
      </button>
    </div>
  )
}