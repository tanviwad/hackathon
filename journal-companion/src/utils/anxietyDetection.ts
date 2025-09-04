// File: src/utils/anxietyDetection.ts
import type { JournalEntry } from '../types'

export interface AnxietyInsight {
  level: 'mild' | 'moderate' | 'high'
  triggers: string[]
  patterns: string[]
  suggestions: string[]
  breathingExercise?: boolean
}

export function detectAnxietyPatterns(entries: JournalEntry[]): AnxietyInsight | null {
  const anxietyKeywords = {
    physical: ['racing heart', 'sweating', 'shaking', 'nausea', 'dizzy', 'tight chest', 'breathing'],
    emotional: ['panic', 'worry', 'fear', 'dread', 'nervous', 'overwhelmed', 'scared'],
    cognitive: ['racing thoughts', 'worst case', 'what if', 'spiral', 'overthinking', 'ruminating'],
    situational: ['social', 'work', 'presentation', 'meeting', 'deadline', 'performance', 'crowd']
  }

  const recentEntries = entries.slice(0, 10)
  let anxietyScore = 0
  const foundTriggers: string[] = []
  const foundPatterns: string[] = []

  recentEntries.forEach(entry => {
    const content = entry.content.toLowerCase()
    
    Object.entries(anxietyKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (content.includes(keyword)) {
          anxietyScore++
          if (category === 'situational') {
            foundTriggers.push(keyword)
          } else {
            foundPatterns.push(`${category}: ${keyword}`)
          }
        }
      })
    })
  })

  if (anxietyScore < 3) return null

  const level: AnxietyInsight['level'] = anxietyScore >= 8 ? 'high' : anxietyScore >= 5 ? 'moderate' : 'mild'
  
  return {
    level,
    triggers: Array.from(new Set(foundTriggers)).slice(0, 3),
    patterns: Array.from(new Set(foundPatterns)).slice(0, 4),
    suggestions: getAnxietySuggestions(level, foundTriggers),
    breathingExercise: level !== 'mild'
  }
}

function getAnxietySuggestions(level: AnxietyInsight['level'], triggers: string[]): string[] {
  const baseSuggestions = [
    "Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
    "Practice deep breathing: 4 counts in, hold for 4, out for 6",
    "Write down your worries, then ask: 'Is this thought helpful? Is it true? What would I tell a friend?'"
  ]

  const triggerSpecific: Record<string, string[]> = {
    'work': ["Schedule 5-minute breaks between tasks", "Set boundaries on work thoughts after hours"],
    'social': ["Practice self-compassion - most people are focused on themselves", "Prepare 2-3 conversation topics ahead of time"],
    'presentation': ["Visualize success, practice out loud", "Remember: the audience wants you to succeed"]
  }

  const suggestions = [...baseSuggestions]
  triggers.forEach(trigger => {
    if (triggerSpecific[trigger]) {
      suggestions.push(...triggerSpecific[trigger])
    }
  })

  return suggestions.slice(0, level === 'high' ? 5 : level === 'moderate' ? 4 : 3)
}