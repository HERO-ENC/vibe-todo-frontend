import { useState, type FormEvent } from 'react'

interface TodoFormProps {
  onAdd: (title: string) => Promise<void> | void
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      await onAdd(trimmed)
      setTitle('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        type="text"
        placeholder="할 일을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn btn-add" type="submit" disabled={submitting || !title.trim()}>
        추가
      </button>
    </form>
  )
}

export default TodoForm
