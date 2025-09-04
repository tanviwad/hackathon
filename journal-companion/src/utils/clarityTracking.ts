// File: src/utils/clarityTracking.ts
import type { JournalEntry } from '../types'

export interface ClarityMetrics {
  beforeWriting: {
    confusion: number
    stress: number
    uncertainty: number
  }
  afterWriting: {
    clarity: number
    resolution: number
    peace: number
  }
  improvement: number
  insights: string[]
}

export function measureClarity(entry: JournalEntry): ClarityMetrics {
  const content = entry.content.toLowerCase()
  
  // Before indicators (negative clarity)
  const confusionWords = ['confused', 'unclear', 'dont know', "don't know", 'unsure', 'lost', 'mixed up']
  const stressWords = ['stressed', 'overwhelmed', 'anxious', 'pressure', 'racing']
  const uncertaintyWords = ['maybe', 'not sure', 'confused', 'uncertain', 'doubt']
  
  // After indicators (positive clarity)
  const clarityWords = ['clear', 'understand', 'realize', 'see now', 'makes sense', 'obvious']
  const resolutionWords = ['decided', 'plan', 'will', 'going to', 'next step', 'action']
  const peaceWords = ['calm', 'better', 'relieved', 'peaceful', 'settled', 'centered']

  const countWords = (words: string[], text: string) => 
    words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0)

  const confusion = countWords(confusionWords, content)
  const stress = countWords(stressWords, content)
  const uncertainty = countWords(uncertaintyWords, content)
  
  const clarity = countWords(clarityWords, content)
  const resolution = countWords(resolutionWords, content)
  const peace = countWords(peaceWords, content)

  const beforeScore = (confusion + stress + uncertainty) / 3
  const afterScore = (clarity + resolution + peace) / 3
  const improvement = afterScore - beforeScore

  const insights = generateClarityInsights(entry, improvement, clarity, resolution)

  return {
    beforeWriting: { confusion, stress, uncertainty },
    afterWriting: { clarity, resolution, peace },
    improvement,
    insights
  }
}

function generateClarityInsights(entry: JournalEntry, improvement: number, clarity: number, resolution: number): string[] {
  const insights: string[] = []
  
  if (improvement > 1) {
    insights.push("🎯 Writing helped you gain significant clarity")
  }
  
  if (clarity >= 2) {
    insights.push("💡 You processed complex thoughts into understanding")
  }
  
  if (resolution >= 2) {
    insights.push("✅ You moved from confusion to actionable next steps")
  }
  
  // Analyze writing patterns for clarity
  const sentences = entry.content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length > 5) {
    const firstHalf = sentences.slice(0, Math.floor(sentences.length / 2)).join(' ').toLowerCase()
    const secondHalf = sentences.slice(Math.floor(sentences.length / 2)).join(' ').toLowerCase()
    
    const firstHalfQuestions = (firstHalf.match(/\?/g) || []).length
    const secondHalfQuestions = (secondHalf.match(/\?/g) || []).length
    
    if (firstHalfQuestions > secondHalfQuestions) {
      insights.push("📝 You started with questions and worked toward answers")
    }
  }

  return insights.slice(0, 3)
}