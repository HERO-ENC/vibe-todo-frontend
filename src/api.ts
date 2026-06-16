import type { Todo } from './types'

// 백엔드 API 주소. .env의 VITE_API_URL을 사용하고,
// 값이 없으면 빈 문자열이 되어 Vite 프록시(/todos -> localhost:5000)로 동작합니다.
const API_URL = import.meta.env.VITE_API_URL ?? ''
const BASE_URL = `${API_URL}/todos`

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `요청 실패 (${res.status})`
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      // JSON 파싱 실패는 무시하고 기본 메시지를 사용합니다.
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export function getTodos(): Promise<Todo[]> {
  return fetch(BASE_URL).then((res) => handleResponse<Todo[]>(res))
}

export function createTodo(title: string): Promise<Todo> {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then((res) => handleResponse<Todo>(res))
}

export function updateTodo(
  id: string,
  data: { title?: string; completed?: boolean },
): Promise<Todo> {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => handleResponse<Todo>(res))
}

export function deleteTodo(id: string): Promise<{ message: string; todo: Todo }> {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  }).then((res) => handleResponse<{ message: string; todo: Todo }>(res))
}
