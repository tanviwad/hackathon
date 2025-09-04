import { useMemo } from 'react'
import { useJournal } from '../store'
import { analyzeSentimentSeries, extractThemes, generatePrompts, generateWeeklySummary } from '../utils/nlp'

export default function Insights() {
  const { entries } = useJournal()
  const series = useMemo(() => analyzeSentimentSeries(entries), [entries])
  const themes = useMemo(() => extractThemes(entries), [entries])
  const prompts = useMemo(() => generatePrompts(entries), [entries])
  const summary = useMemo(() => generateWeeklySummary(entries), [entries])

  return (
    <section className="rounded-xl border border-rose-100 bg-white p-4 sm:p-6 shadow-sm space-y-5">
      <h2 className="text-lg font-medium">Insights</h2>

      <div>
        <h3 className="text-sm font-medium text-gray-700">Dynamic Prompts</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          {prompts.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
          {prompts.length === 0 && <li>What felt meaningful today?</li>}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700">Themes</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {themes.map((t) => (
            <span key={t.term} className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs text-pink-800">
              {t.term} · {t.count}
            </span>
          ))}
          {themes.length === 0 && <span className="text-sm text-gray-500">No themes yet</span>}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700">Weekly Reflection</h3>
        <p className="mt-2 text-sm text-gray-700">{summary}</p>
      </div>
    </section>
  )
}


