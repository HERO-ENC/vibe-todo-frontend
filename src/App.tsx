import { useEffect, useState } from 'react'
import './App.css'
import type { Todo } from './types'
import * as api from './api'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTodos = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getTodos()
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleAdd = async (title: string) => {
    try {
      const created = await api.createTodo(title)
      setTodos((prev) => [created, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일 추가에 실패했습니다.')
    }
  }

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await api.updateTodo(id, { completed })
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '상태 변경에 실패했습니다.')
    }
  }

  const handleEdit = async (id: string, title: string) => {
    try {
      const updated = await api.updateTodo(id, { title })
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일 수정에 실패했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일 삭제에 실패했습니다.')
    }
  }

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <div className="app">
      <header className="app-header">
        <h1>할 일 목록</h1>
        <p className="subtitle">남은 할 일 {remaining}개</p>
      </header>

      <TodoForm onAdd={handleAdd} />

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">불러오는 중...</p>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App
