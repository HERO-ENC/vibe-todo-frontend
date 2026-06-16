import { useState } from 'react'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string, title: string) => Promise<void> | void
  onDelete: (id: string) => void
}

function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)

  const startEdit = () => {
    setDraft(todo.title)
    setEditing(true)
  }

  const cancelEdit = () => {
    setDraft(todo.title)
    setEditing(false)
  }

  const saveEdit = async () => {
    const trimmed = draft.trim()
    if (!trimmed || trimmed === todo.title) {
      cancelEdit()
      return
    }
    await onEdit(todo._id, trimmed)
    setEditing(false)
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        className="todo-checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id, !todo.completed)}
      />

      {editing ? (
        <input
          className="todo-edit-input"
          type="text"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit()
            if (e.key === 'Escape') cancelEdit()
          }}
        />
      ) : (
        <span className="todo-title" onDoubleClick={startEdit}>
          {todo.title}
        </span>
      )}

      <div className="todo-actions">
        {editing ? (
          <>
            <button className="btn btn-save" onClick={saveEdit}>
              저장
            </button>
            <button className="btn btn-cancel" onClick={cancelEdit}>
              취소
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-edit" onClick={startEdit}>
              수정
            </button>
            <button className="btn btn-delete" onClick={() => onDelete(todo._id)}>
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
