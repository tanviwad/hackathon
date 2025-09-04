// DEMO DATA ONLY - NOT FOR PRODUCTION USE
// This file is for testing the clarity tracking feature with realistic data
// Spans 3 weeks with realistic day distribution

import type { JournalEntry } from '../types'

const createEntry = (daysAgo: number, hour: number, minute: number, id: string, content: string, mood: any) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, minute, 0, 0)
  return {
    id,
    createdAt: date.toISOString(),
    content,
    mood
  }
}

export const DEMO_ENTRIES: JournalEntry[] = [
  // Week 1 (Most Recent) - 7 entries across different days
  createEntry(1, 20, 15, 'demo-1', 
    `Good day overall! Work had its challenges but I felt productive and accomplished. Hit a new personal record at the gym - my consistent training is really paying off. Grabbed dinner with a colleague after and had great conversations about our career goals. Feeling optimistic about the direction things are heading.`,
    'good'
  ),
  
  createEntry(3, 19, 30, 'demo-2',
    `Work was really draining today. Had back-to-back meetings from 9 to 4, and by the time I got to the gym I could barely lift half my usual weights. Feeling exhausted and wondering if I'm pushing myself too hard. Maybe I need to reassess my schedule or find better ways to manage my energy throughout the day.`,
    'bad'
  ),
  
  createEntry(4, 10, 45, 'demo-3',
    `Perfect Saturday! Slept in until 9 (luxury!), then had an amazing workout without feeling rushed. Spent the afternoon with my family - we tried that new restaurant downtown and laughed until our sides hurt. Feeling so grateful for these moments of connection. Sometimes the best therapy is just being around the people you love.`,
    'great'
  ),
  
  createEntry(5, 21, 20, 'demo-4',
    `Solid Tuesday. The morning started with a productive team meeting where my ideas were well-received. Gym session after work was energizing - I love how lifting weights clears my mental fog. Caught up with my brother on the phone during my walk home. Small wins, but they add up to a good day.`,
    'good'
  ),
  
  createEntry(6, 18, 50, 'demo-5',
    `So tired today I almost skipped the gym entirely. Ended up going but just did a light cardio session. Work has been overwhelming lately with this new project deadline approaching. Feel like I'm running on empty and not giving my best to anyone - work, friends, or family. Need to find a better balance.`,
    'bad'
  ),
  
  createEntry(7, 19, 10, 'demo-6',
    `Really grateful for today's rhythm. Work flowed well, knocked out my to-do list efficiently. The gym was crowded but I adjusted my workout and discovered I actually enjoy the busier energy sometimes. Met up with friends for coffee after and we planned our weekend adventure. Life feels balanced right now.`,
    'good'
  ),
  
  createEntry(7, 15, 30, 'demo-6b', // Same day, different entry
    `Sunday funday with friends! We went hiking and it felt so good to be outdoors and away from screens. The conversation flowed naturally and I remembered why these friendships mean so much to me. Came home feeling recharged and ready for the week ahead. These social connections really feed my soul.`,
    'great'
  ),
  
  // Week 2 - 7 entries across different days
  createEntry(9, 20, 40, 'demo-7',
    `What a confidence boost today was! Nailed my presentation at work and got positive feedback from my manager. The gym session afterward felt like a victory lap - every rep felt strong and purposeful. Dinner with friends was the perfect way to celebrate. Feeling proud of how I'm showing up in all areas of life.`,
    'great'
  ),
  
  createEntry(11, 19, 15, 'demo-8',
    `Another exhausting day. The 9-5 felt like 9-8 with all the extra tasks piling up. By the time I finished my workout, I was too drained to properly catch up with my friends who texted about hanging out. Feel guilty about not being present enough for the people I care about when work drains all my energy.`,
    'very-bad'
  ),
  
  createEntry(12, 21, 0, 'demo-9',
    `Steady, productive day. Nothing dramatic, but sometimes those are the best kind. Work had good momentum, made progress on the project I've been focused on. Gym routine felt automatic in the best way - my body knew what to do. Quick FaceTime with family before bed reminded me how supported I am.`,
    'good'
  ),
  
  createEntry(13, 20, 25, 'demo-10',
    `Really appreciating my routine lately. The structure of work-gym-social time is serving me well. Today I felt present in each part of my day instead of rushing through. Had a breakthrough on a work problem that's been bugging me, crushed my workout, and had meaningful conversations with friends. Feeling aligned.`,
    'great'
  ),
  
  createEntry(14, 18, 40, 'demo-11',
    `Feeling burnt out today. Work was mentally taxing and even though I pushed through my workout, I feel like I'm just going through the motions. Called my family but could barely focus on the conversation. This fatigue is affecting everything - my motivation, my relationships, my mood. Need to figure out how to recharge better.`,
    'bad'
  ),
  
  createEntry(14, 11, 30, 'demo-11b', // Weekend morning entry same day
    `Lazy Sunday that was exactly what I needed. No alarms, no rush. Did a gentle yoga session instead of my usual intense workout. Spent hours video calling with family, catching up properly for the first time in weeks. Feel like I found some balance today between rest and connection.`,
    'good'
  ),
  
  createEntry(15, 19, 45, 'demo-12',
    `Challenging but rewarding day at work. The kind where you feel stretched but not broken. Gym session was therapeutic - nothing like physical movement to process mental stress. Evening with friends provided the perfect counterbalance. We talked about our dreams and fears, and I felt so understood and supported.`,
    'good'
  ),
  
  // Week 3 - 7 entries across different days
  createEntry(16, 20, 10, 'demo-13',
    `Today reminded me why I love my current life setup. Work was engaging without being overwhelming, my workout gave me that perfect endorphin high, and spontaneous drinks with friends after turned into deep conversations about where we're all headed. Feeling grateful for this season of life.`,
    'great'
  ),
  
  createEntry(18, 18, 20, 'demo-14',
    `Dragging myself through today. The morning started rough and work didn't help - felt like I was swimming upstream all day. Made it to the gym but my energy was so low I cut the session short. Feeling frustrated with myself for not being able to maintain my usual energy levels. Tomorrow has to be better.`,
    'bad'
  ),
  
  createEntry(19, 16, 15, 'demo-15',
    `Weekend vibes were perfect. Friday night dinner with friends led to spontaneous plans all weekend. We explored the farmers market, tried a new fitness class together, and ended Sunday with a movie marathon. I feel so lucky to have such wonderful people in my life who make even ordinary moments special.`,
    'great'
  ),
  
  createEntry(20, 21, 30, 'demo-16',
    `Productive Wednesday! Tackled some challenging problems at work and felt that satisfying sense of accomplishment. The gym was my reward - tried a new exercise routine and loved the challenge. Called my parents during my cool-down walk and their encouragement made my heart full. Good day to be alive.`,
    'good'
  ),
  
  createEntry(21, 19, 5, 'demo-17',
    `Exhausted doesn't even begin to cover it. Work stress is definitely taking its toll on my sleep quality, which makes everything harder. Even my usual post-gym endorphins couldn't lift this heavy feeling. Declined dinner with friends because I just don't have the social energy right now. Feeling isolated.`,
    'very-bad'
  ),
  
  createEntry(22, 20, 50, 'demo-18',
    `Feeling really centered today. Work had its usual stress but I handled it with more calm than usual. My workout was strong and focused - I think I'm getting better at leaving work stress in the office. Dinner plans with friends got moved to next week, but honestly, a quiet evening at home sounds perfect right now.`,
    'neutral'
  ),
  
  createEntry(23, 14, 45, 'demo-19',
    `Family time was exactly what I needed today. We cooked together, played board games, and just enjoyed each other's company without any agenda. It's amazing how being around family can instantly make everything feel more manageable. Grateful for these roots and this support system.`,
    'good'
  ),
  
  // Additional entries to show some days with multiple entries
  createEntry(9, 8, 30, 'demo-20', // Same day as demo-7, morning entry
    `Starting the day with some anxiety about the big presentation. Had a restless night thinking about all the ways it could go wrong. But I know I've prepared well. Going to hit the gym first to clear my head, then tackle the day with confidence.`,
    'anxious'
  ),
  
  createEntry(16, 9, 15, 'demo-21', // Same day as demo-13, morning entry
    `Woke up feeling grateful. The sun is streaming through my windows and I have nowhere urgent to be. Planning a slow morning with coffee and journaling before meeting friends for brunch. These peaceful moments are what I live for.`,
    'peaceful'
  )
]
