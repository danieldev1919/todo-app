import { reactive, computed } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const state = reactive({
  todos: [],
  filter: 'all',
  loading: false,
})

const filteredTodos = computed(() => {
  if (state.filter === 'active') {
    return state.todos.filter((todo) => !todo.done)
  }
  if (state.filter === 'completed') {
    return state.todos.filter((todo) => todo.done)
  }
  return state.todos
})

const todosRemaining = computed(() => state.todos.filter((todo) => !todo.done).length)

async function fetchTodos() {
  state.loading = true
  try {
    const res = await fetch(`${API_BASE}/todos`)
    if (res.ok) {
      const data = await res.json()
      state.todos.splice(0, state.todos.length, ...data)
    }
  } catch {
    // API not available, keep existing state
  } finally {
    state.loading = false
  }
}

export const store = {
  get todos() {
    return state.todos
  },

  get filter() {
    return state.filter
  },

  get filteredTodos() {
    return filteredTodos.value
  },

  get todosRemaining() {
    return todosRemaining.value
  },

  get loading() {
    return state.loading
  },

  async addTodo(text, priority = false) {
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, priority }),
      })
      if (res.ok) {
        const todo = await res.json()
        state.todos.push(todo)
      }
    } catch {
      // Fallback to local add if API unavailable
      const id = crypto.randomUUID()
      state.todos.push({ id, text: trimmed, done: false, priority })
    }
  },

  async toggleTodo(id) {
    const todo = state.todos.find((t) => t.id === id)
    if (todo) {
      todo.done = !todo.done
      try {
        await fetch(`${API_BASE}/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: todo.done }),
        })
      } catch {
        // API unavailable, local state already updated
      }
    }
  },

  async deleteTodo(id) {
    const index = state.todos.findIndex((t) => t.id === id)
    if (index !== -1) {
      state.todos.splice(index, 1)
      try {
        await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' })
      } catch {
        // API unavailable, local state already updated
      }
    }
  },

  async setPriority(id, priority) {
    const todo = state.todos.find((t) => t.id === id)
    if (todo) {
      todo.priority = priority
      try {
        await fetch(`${API_BASE}/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority }),
        })
      } catch {
        // API unavailable, local state already updated
      }
    }
  },

  setFilter(filter) {
    state.filter = filter
  },

  clearCompleted() {
    const completed = state.todos.filter((todo) => todo.done)
    const remaining = state.todos.filter((todo) => !todo.done)
    state.todos.splice(0, state.todos.length, ...remaining)
    // Delete completed from API in background
    Promise.allSettled(completed.map(async (todo) => {
      try {
        await fetch(`${API_BASE}/todos/${todo.id}`, { method: 'DELETE' })
      } catch {
        // ignore
      }
    }))
  },

  async init() {
    await fetchTodos()
  },

  resetForTest() {
    state.todos.splice(0, state.todos.length)
    state.filter = 'all'
    state.loading = false
  },
}
