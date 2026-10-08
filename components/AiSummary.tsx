import { Sparkles } from 'lucide-react'

const HEADINGS = /^(Document type|Summary|Medicines.*|Test results|Points to discuss with your doctor)\s*:/i

/** Shows the AI reading of a file with its section headings in bold. */
export default function AiSummary({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="ai-box">
      <div className="ai-title"><Sparkles size={15} /> Automatic reading of your file</div>
      <div className="ai-text">
        {lines.map((line, i) => {
          const m = line.match(HEADINGS)
          if (m) {
            const head = line.slice(0, line.indexOf(':') + 1)
            return <div key={i}><strong>{head}</strong>{line.slice(head.length)}</div>
          }
          return <div key={i}>{line || '\u00A0'}</div>
        })}
      </div>
    </div>
  )
}
