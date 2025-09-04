import type { JournalEntry } from '../types'

const POSITIVE_WORDS = [
  'calm','grateful','joy','happy','peace','relaxed','energized','excited','love','proud','confident','win','progress','creative','focus','productive','hope','kind','connected','rested','walk','sun','good','great','awesome','better'
]
const NEGATIVE_WORDS = [
  'stress','stressed','anxious','anxiety','sad','tired','overwhelmed','angry','frustrated','lonely','worried','fail','stuck','blocked','bad','worse','hurt','guilty','shame','fear','panic','drained'
]

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','so','to','of','in','on','for','with','is','am','are','was','were','be','been','it','this','that','at','as','by','from','we','i','me','my','our','your','you'
])

export function scoreSentiment(text: string) {
  const tokens = tokenize(text)
  let pos = 0, neg = 0
  for (const t of tokens) {
    if (POSITIVE_WORDS.includes(t)) pos++
    if (NEGATIVE_WORDS.includes(t)) neg++
  }
  const total = pos + neg
  const score = total === 0 ? 0 : (pos - neg) / total
  const label = score > 0.25 ? 'positive' : score < -0.25 ? 'negative' : 'neutral'
  return { score, label, pos, neg }
}

export function analyzeSentimentSeries(entries: JournalEntry[]) {
  return entries
    .slice()
    .reverse()
    .map((e) => ({ date: new Date(e.createdAt), score: scoreSentiment(e.content).score }))
}

export function extractThemes(entries: JournalEntry[], topN = 6) {
  const counts = new Map<string, number>()
  for (const e of entries) {
    for (const t of tokenize(e.content)) {
      if (STOPWORDS.has(t)) continue
      if (t.length < 3) continue
      counts.set(t, (counts.get(t) || 0) + 1)
    }
  }
  const list = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  return list.slice(0, topN).map(([term, count]) => ({ term, count }))
}

export function generatePrompts(entries: JournalEntry[]) {
  const recent = entries.slice(0, 10)
  const text = recent.map((e) => e.content).join(' \n ')
  const lower = text.toLowerCase()
  const prompts: string[] = []
  if (/work|deadline|manager|meeting|career/.test(lower)) {
    prompts.push('How did you find moments of calm at work today?')
  }
  if (/stress|anxious|overwhelm|worry/.test(lower)) {
    prompts.push('What helped you feel a little lighter today, even briefly?')
  }
  if (/family|friend|partner|relationship/.test(lower)) {
    prompts.push('What felt supportive in your relationships this week?')
  }
  if (/walk|run|yoga|exercise|gym|movement|outside|sun/.test(lower)) {
    prompts.push('Did movement or time outside shift your mood today?')
  }
  if (/creative|idea|write|art|music|build/.test(lower)) {
    prompts.push('When did creativity show up today, even in small ways?')
  }
  if (prompts.length < 3) {
    prompts.push('What felt meaningful or surprising about today?')
  }
  return prompts.slice(0, 3)
}

export function generateWeeklySummary(entries: JournalEntry[]) {
  if (entries.length === 0) return 'No entries yet for a weekly reflection.'
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(now.getDate() - 7)
  const recent = entries.filter((e) => new Date(e.createdAt) >= weekAgo)
  if (recent.length === 0) return 'No entries in the last week.'
  const avg =
    recent.map((e) => scoreSentiment(e.content).score).reduce((a, b) => a + b, 0) / recent.length
  const mood = avg > 0.25 ? 'upbeat' : avg < -0.25 ? 'heavy' : 'steady'
  const themes = extractThemes(recent, 3)
  const themeText = themes.map((t) => t.term).join(', ')

  const movement = /walk|run|yoga|exercise|outside|sunlight|steps/i.test(recent.map((e) => e.content).join(' '))
  const creative = /creative|idea|wrote|art|music|design|build/i.test(recent.map((e) => e.content).join(' '))

  let extras = ''
  if (movement) extras += ' You mentioned feeling more energized on days you moved or got outside.'
  if (creative) extras += ' Creative moments appeared on several days and seemed to lift your mood.'

  return `This week felt ${mood}. Themes that surfaced: ${themeText || '—'}.${extras}`
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}


