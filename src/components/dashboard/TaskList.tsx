import { useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { Task, TaskTag } from '@/types/habits'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onAdd: (text: string, tag: TaskTag) => void
}

const TAG_COLORS: Record<TaskTag, string> = {
  work:     '#00e5ff',
  learn:    '#9d4edd',
  write:    '#00ff9d',
  drama:    '#ff9100',
  personal: '#ff2d78',
}

export default function TaskList({ tasks, onToggle, onAdd }: TaskListProps) {
  const [input, setInput] = useState('')
  const [tag, setTag] = useState<TaskTag>('work')

  const pending   = tasks.filter(t => !t.done)
  const completed = tasks.filter(t => t.done)

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onAdd(trimmed, tag)
    setInput('')
  }

  return (
    <Card accent="purple">
      <p className="text-[10px] font-orbitron font-bold tracking-widest text-purple-400 uppercase mb-3">
        Today's Tasks
      </p>

      <ul className="space-y-1 mb-3">
        {pending.map(t => (
          <TaskRow key={t.id} task={t} onToggle={onToggle} />
        ))}
        {completed.map(t => (
          <TaskRow key={t.id} task={t} onToggle={onToggle} />
        ))}
      </ul>

      <div className="flex gap-2 mt-3">
        <select
          value={tag}
          onChange={e => setTag(e.target.value as TaskTag)}
          className="bg-white/5 border border-purple-900/30 rounded-lg px-2 py-1 text-xs text-purple-300 outline-none"
          style={{ color: TAG_COLORS[tag] }}
        >
          {(Object.keys(TAG_COLORS) as TaskTag[]).map(t => (
            <option key={t} value={t} style={{ color: TAG_COLORS[t], background: '#0f0f2a' }}>{t}</option>
          ))}
        </select>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add task..."
          className="flex-1 bg-white/5 border border-purple-900/30 rounded-lg px-3 py-1 text-xs text-purple-200 placeholder-purple-700 outline-none focus:border-purple-600"
        />
        <button
          onClick={handleAdd}
          className="w-7 h-7 rounded-lg bg-purple-900/40 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-800/60 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </Card>
  )
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return (
    <li
      onClick={() => onToggle(task.id)}
      className="flex items-center gap-2 cursor-pointer group py-0.5"
    >
      <span
        className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
          task.done ? 'border-transparent' : 'border-purple-700 group-hover:border-purple-400'
        }`}
        style={task.done ? { background: TAG_COLORS[task.tag], boxShadow: `0 0 6px ${TAG_COLORS[task.tag]}66` } : undefined}
      >
        {task.done && <span className="text-[8px] text-[#0a0a1a] font-bold">✓</span>}
      </span>
      <span className={`text-xs flex-1 ${task.done ? 'line-through text-purple-600' : 'text-purple-200'}`}>
        {task.text}
      </span>
      <span
        className="text-[9px] font-mono px-1 rounded"
        style={{ color: TAG_COLORS[task.tag], background: `${TAG_COLORS[task.tag]}18` }}
      >
        {task.tag}
      </span>
    </li>
  )
}
