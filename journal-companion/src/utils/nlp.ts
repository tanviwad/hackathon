import type { JournalEntry, Theme } from '../types'

// Emotion and life theme categories
const EMOTION_THEMES = {
  // Positive emotions
  'joy': ['happy', 'joyful', 'cheerful', 'delighted', 'elated', 'euphoric', 'blissful', 'ecstatic', 'gleeful', 'jubilant'],
  'gratitude': ['grateful', 'thankful', 'blessed', 'appreciative', 'fortunate', 'touched', 'moved'],
  'confidence': ['confident', 'proud', 'accomplished', 'successful', 'capable', 'strong', 'empowered', 'self-assured'],
  'calm': ['peaceful', 'relaxed', 'serene', 'tranquil', 'centered', 'balanced', 'zen', 'composed', 'steady'],
  'excitement': ['excited', 'thrilled', 'enthusiastic', 'energized', 'pumped', 'eager', 'animated', 'exhilarated'],
  'love': ['love', 'loving', 'affection', 'warmth', 'connection', 'bond', 'caring', 'adoration', 'tenderness'],
  'hope': ['hopeful', 'optimistic', 'positive', 'bright', 'promising', 'encouraging', 'uplifting', 'inspiring'],
  'contentment': ['content', 'satisfied', 'fulfilled', 'pleased', 'comfortable', 'at-peace'],

  // Challenging emotions
  'stress': ['stressed', 'pressure', 'overwhelmed', 'burden', 'tension', 'strain', 'frazzled', 'swamped'],
  'anxiety': ['anxious', 'worried', 'nervous', 'apprehensive', 'fearful', 'panic', 'uneasy', 'restless', 'on-edge'],
  'sadness': ['sad', 'depressed', 'down', 'blue', 'melancholy', 'grief', 'sorrow', 'heartbroken', 'dejected', 'despondent'],
  'anger': ['angry', 'frustrated', 'irritated', 'annoyed', 'mad', 'furious', 'rage', 'livid', 'resentful', 'indignant'],
  'loneliness': ['lonely', 'isolated', 'alone', 'disconnected', 'solitary', 'abandoned', 'rejected'],
  'fatigue': ['tired', 'exhausted', 'drained', 'weary', 'burnt', 'depleted', 'worn-out', 'fatigued'],
  'confusion': ['confused', 'uncertain', 'lost', 'unclear', 'puzzled', 'bewildered', 'perplexed', 'disoriented'],
  'disappointment': ['disappointed', 'let-down', 'disillusioned', 'discouraged', 'deflated'],
  'guilt': ['guilty', 'ashamed', 'regretful', 'remorseful', 'self-blame'],

  // Life areas
  'work': ['work', 'job', 'career', 'office', 'meeting', 'project', 'deadline', 'boss', 'colleague', 'client'],
  'relationships': ['family', 'friend', 'partner', 'spouse', 'relationship', 'social', 'date', 'marriage'],
  'health': ['health', 'exercise', 'gym', 'workout', 'run', 'walk', 'yoga', 'meditation', 'sleep'],
  'creativity': ['creative', 'art', 'music', 'write', 'writing', 'design', 'paint', 'craft', 'idea'],
  'learning': ['learn', 'study', 'read', 'book', 'course', 'skill', 'knowledge', 'education'],
  'travel': ['travel', 'trip', 'vacation', 'journey', 'adventure', 'explore', 'visit'],
  'home': ['home', 'house', 'family', 'cooking', 'garden', 'clean', 'organize'],
  'finance': ['money', 'budget', 'save', 'spend', 'buy', 'expensive', 'cheap', 'financial'],
  'nature': ['nature', 'outside', 'park', 'trees', 'flowers', 'beach', 'mountains', 'sun', 'weather']
}

// Words to always exclude from themes (generic/common words)
const EXCLUDED_WORDS = new Set([
  // Time words
  'today', 'yesterday', 'tomorrow', 'day', 'week', 'month', 'year', 'time', 'morning', 'evening', 'night',
  // Generic descriptors
  'thing', 'things', 'stuff', 'way', 'ways', 'lot', 'lots', 'bit', 'little', 'much',
  'big', 'small', 'new', 'old', 'nice', 'awesome', 'amazing', 'incredible',
  'really', 'very', 'quite', 'pretty', 'kind', 'sort', 'type', 'part', 'whole',
  // Places and people (too generic)
  'place', 'people', 'person', 'guy', 'girl', 'man', 'woman', 'everyone', 'someone',
  // Common actions
  'make', 'made', 'get', 'got', 'go', 'went', 'come', 'came', 'see', 'saw', 'look', 'looked',
  'know', 'think', 'want', 'need', 'like', 'hate', 'give', 'take', 'find', 'found',
  'said', 'say', 'tell', 'told', 'talk', 'talked', 'ask', 'asked', 'call', 'called',
  // Generic emotional words (we want specific emotions from EMOTION_THEMES instead)
  'feel', 'feeling', 'feelings', 'emotion', 'emotions', 'mood', 'moods',
  'good', 'bad', 'okay', 'fine', 'well', 'better', 'worse', 'best', 'worst',
  // Greetings and common expressions
  'hello', 'hi', 'hey', 'thanks', 'thank', 'please', 'sorry', 'excuse',
  // Articles, pronouns, conjunctions (should already be in STOPWORDS but adding for safety)
  'this', 'that', 'these', 'those', 'here', 'there', 'where', 'when', 'what', 'how', 'why',
  'something', 'anything', 'everything', 'nothing', 'somewhere', 'anywhere', 'everywhere',
  // Filler words
  'just', 'only', 'still', 'even', 'also', 'maybe', 'probably', 'definitely', 'certainly'
])

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'so', 'to', 'of', 'in', 'on', 'for', 
  'with', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'it', 'this', 'that', 'at', 'as', 
  'by', 'from', 'we', 'i', 'me', 'my', 'our', 'your', 'you', 'he', 'she', 'they', 'them',
  'have', 'has', 'had', 'do', 'did', 'does', 'will', 'would', 'could', 'should', 'can',
  'just', 'really', 'very', 'much', 'more', 'most', 'some', 'any', 'all'
])

// Enhanced word lists for sentiment analysis
const POSITIVE_WORDS = [
  'amazing', 'awesome', 'beautiful', 'brilliant', 'calm', 'confident', 'creative', 'delighted', 
  'energized', 'excited', 'fantastic', 'grateful', 'happy', 'incredible', 'inspired', 'joy', 
  'love', 'motivated', 'optimistic', 'peaceful', 'positive', 'proud', 'relaxed', 'satisfied', 
  'successful', 'thrilled', 'wonderful', 'accomplished', 'breakthrough', 'progress', 'victory',
  'celebration', 'achievement', 'smile', 'laugh', 'hope', 'blessed', 'fortunate', 'content',
  'good', 'great', 'better', 'best', 'win', 'won', 'success', 'productive', 'focus', 'clear'
]

const NEGATIVE_WORDS = [
  'angry', 'anxious', 'awful', 'disappointed', 'exhausted', 'frustrated', 'lonely', 'overwhelmed',
  'sad', 'stressed', 'terrible', 'tired', 'worried', 'depressed', 'discouraged', 'fearful',
  'hopeless', 'irritated', 'nervous', 'upset', 'troubled', 'defeated', 'drained', 'burnt',
  'struggle', 'difficult', 'challenging', 'hard', 'tough', 'problem', 'issue', 'concern',
  'anxiety', 'panic', 'doubt', 'confusion', 'chaos', 'crisis', 'failure', 'mistake',
  'bad', 'worse', 'worst', 'fail', 'failed', 'stuck', 'blocked', 'hurt', 'pain', 'shame'
]

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

export function analyzeSentiment(text: string): number {
  const words = tokenize(text)
  let positiveCount = 0
  let negativeCount = 0
  let totalRelevantWords = 0

  words.forEach(word => {
    if (POSITIVE_WORDS.includes(word)) {
      positiveCount++
      totalRelevantWords++
    } else if (NEGATIVE_WORDS.includes(word)) {
      negativeCount++
      totalRelevantWords++
    }
  })

  if (totalRelevantWords === 0) return 0
  
  const sentiment = (positiveCount - negativeCount) / Math.max(totalRelevantWords, 1)
  return Math.max(-1, Math.min(1, sentiment))
}

export function extractThemes(entries: JournalEntry[]): Theme[] {
  if (entries.length === 0) return []

  const themeScores = new Map<string, { count: number; sentiments: number[] }>()
  
  // Initialize all emotion themes
  Object.keys(EMOTION_THEMES).forEach(theme => {
    themeScores.set(theme, { count: 0, sentiments: [] })
  })

  entries.forEach(entry => {
    const words = tokenize(entry.content)
    const sentiment = analyzeSentiment(entry.content)
    const entryThemes = new Set<string>() // Track themes found in this entry
    
    // Check for emotion and life themes
    Object.entries(EMOTION_THEMES).forEach(([themeName, keywords]) => {
      const hasTheme = keywords.some(keyword => words.includes(keyword))
      if (hasTheme && !entryThemes.has(themeName)) {
        entryThemes.add(themeName)
        const theme = themeScores.get(themeName)!
        theme.count++
        theme.sentiments.push(sentiment)
      }
    })

    // Look for other meaningful life-area words (but be very selective)
    words.forEach(word => {
      // Only include words that are likely to be meaningful life areas or activities
      const isMeaningfulWord = (
        // Life areas from EMOTION_THEMES
        ['work', 'family', 'health', 'exercise', 'creative', 'learning', 'travel', 'home', 'finance', 'nature'].includes(word) ||
        // Common meaningful activities/concepts
        ['job', 'career', 'workout', 'gym', 'project', 'meeting', 'deadline', 'friend', 'friends', 
         'relationship', 'partner', 'spouse', 'parent', 'parents', 'brother', 'sister',
         'school', 'study', 'book', 'movie', 'music', 'art', 'cooking', 'vacation', 'trip'].includes(word)
      )
      
      if (
        !STOPWORDS.has(word) && 
        !EXCLUDED_WORDS.has(word) &&
        word.length >= 4 &&
        !Object.values(EMOTION_THEMES).flat().includes(word) && // Don't double count emotion keywords
        isMeaningfulWord // Only include words we specifically identify as meaningful
      ) {
        if (!themeScores.has(word)) {
          themeScores.set(word, { count: 0, sentiments: [] })
        }
        if (!entryThemes.has(word)) {
          entryThemes.add(word)
          const theme = themeScores.get(word)!
          theme.count++
          theme.sentiments.push(sentiment)
        }
      }
    })
  })

  // Convert to Theme objects and filter
  const themes = Array.from(themeScores.entries())
    .map(([term, data]) => ({
      term,
      count: data.count,
      sentiment: data.sentiments.length > 0 
        ? data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length 
        : 0
    }))
    .filter(theme => {
      // For emotions: show if appears at least once
      // For life areas: show if appears at least twice
      const isEmotion = Object.keys(EMOTION_THEMES).includes(theme.term)
      return isEmotion ? theme.count >= 1 : theme.count >= 2
    })
    .sort((a, b) => {
      // Heavily prioritize emotion themes
      const aIsEmotion = Object.keys(EMOTION_THEMES).includes(a.term)
      const bIsEmotion = Object.keys(EMOTION_THEMES).includes(b.term)
      
      // If one is emotion and other isn't, emotion wins
      if (aIsEmotion && !bIsEmotion) return -1
      if (!aIsEmotion && bIsEmotion) return 1
      
      // If both are emotions OR both are life areas, sort by count
      return b.count - a.count
    })
    .slice(0, 6) // Reduce to 6 themes to focus on most important

  return themes
}

export function analyzeSentimentSeries(entries: JournalEntry[]) {
  return entries
    .slice()
    .reverse()
    .map((e) => ({ 
      date: new Date(e.createdAt), 
      score: analyzeSentiment(e.content) 
    }))
}

export function generateDynamicPrompts(entries: JournalEntry[]): string[] {
  if (entries.length === 0) {
    return [
      "What made you smile today, even if just for a moment?",
      "What's one thing you're curious about right now?",
      "How are you feeling in your body today?"
    ]
  }

  const recentEntries = entries.slice(0, 5)
  const themes = extractThemes(recentEntries)
  const avgSentiment = recentEntries.reduce((sum, entry) => sum + analyzeSentiment(entry.content), 0) / recentEntries.length
  
  const prompts: string[] = []

  // Sentiment-based prompts
  if (avgSentiment < -0.3) {
    prompts.push("What's one small thing that brought you comfort today?")
    prompts.push("What would you tell a friend who was going through something similar?")
    prompts.push("What's helping you get through this challenging time?")
  } else if (avgSentiment > 0.3) {
    prompts.push("What's contributing to your positive energy lately?")
    prompts.push("How can you carry this good feeling into tomorrow?")
    prompts.push("What are you most grateful for right now?")
  }

  // Theme-based prompts
  const topThemes = themes.slice(0, 3).map(t => t.term)
  
  if (topThemes.includes('work')) {
    prompts.push("How did work impact your energy and mood today?")
    prompts.push("What's one thing about your work situation you'd like to change?")
  }

  if (topThemes.includes('relationships')) {
    prompts.push("What's something you appreciate about your relationships right now?")
    prompts.push("How did connection (or lack thereof) show up in your day?")
  }

  if (topThemes.includes('stress') || topThemes.includes('anxiety')) {
    prompts.push("What helped you feel more grounded today?")
    prompts.push("What's one thing you can let go of right now?")
  }

  if (topThemes.includes('creativity')) {
    prompts.push("What inspired your creativity today?")
    prompts.push("How did creative expression change how you felt?")
  }

  if (topThemes.includes('health')) {
    prompts.push("How did you take care of your body and mind today?")
    prompts.push("What made you feel most energized or alive?")
  }

  // Default prompts if we don't have enough
  if (prompts.length < 3) {
    prompts.push("What surprised you about today?")
    prompts.push("What are you grateful for, big or small?")
    prompts.push("How did you show kindness to yourself or others?")
    prompts.push("What's one thing you learned about yourself recently?")
  }

  return prompts.slice(0, 3)
}

export function generateWeeklyInsights(entries: JournalEntry[]): string {
  if (entries.length === 0) return "Start journaling to see your weekly patterns and insights here."

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const weeklyEntries = entries.filter(entry => new Date(entry.createdAt) >= weekAgo)
  
  if (weeklyEntries.length === 0) {
    return "No entries from the past week. Consider writing about what's been on your mind lately."
  }

  const themes = extractThemes(weeklyEntries)
  const avgSentiment = weeklyEntries.reduce((sum, entry) => sum + analyzeSentiment(entry.content), 0) / weeklyEntries.length
  
  let insights = `This week, you wrote ${weeklyEntries.length} ${weeklyEntries.length === 1 ? 'entry' : 'entries'}. `
  
  if (avgSentiment > 0.2) {
    insights += "Your overall emotional tone has been quite positive. "
  } else if (avgSentiment < -0.2) {
    insights += "It sounds like you've been working through some challenges. "
  } else {
    insights += "Your emotional tone has been balanced this week. "
  }

  if (themes.length > 0) {
    const emotionThemes = themes.filter(t => Object.keys(EMOTION_THEMES).includes(t.term))
    const lifeThemes = themes.filter(t => !Object.keys(EMOTION_THEMES).includes(t.term))
    
    if (emotionThemes.length > 0) {
      const topEmotions = emotionThemes.slice(0, 2).map(t => t.term).join(' and ')
      insights += `Key emotions that came up: ${topEmotions}. `
    }
    
    if (lifeThemes.length > 0) {
      const topLife = lifeThemes.slice(0, 2).map(t => t.term).join(' and ')
      insights += `Main life areas you focused on: ${topLife}. `
    }
  }

  // Pattern insights
  const morningEntries = weeklyEntries.filter(e => new Date(e.createdAt).getHours() < 12).length
  const eveningEntries = weeklyEntries.filter(e => new Date(e.createdAt).getHours() >= 18).length
  
  if (morningEntries > eveningEntries) {
    insights += "You tend to write more in the mornings - great for setting daily intentions."
  } else if (eveningEntries > morningEntries) {
    insights += "You often write in the evenings - a wonderful way to process your day."
  }

  return insights
}

// Legacy functions for backward compatibility
export function scoreSentiment(text: string) {
  const score = analyzeSentiment(text)
  const label = score > 0.25 ? 'positive' : score < -0.25 ? 'negative' : 'neutral'
  return { score, label, pos: 0, neg: 0 }
}

export function generatePrompts(entries: JournalEntry[]) {
  return generateDynamicPrompts(entries)
}

export function generateWeeklySummary(entries: JournalEntry[]) {
  return generateWeeklyInsights(entries)
}