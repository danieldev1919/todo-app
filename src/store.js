import { reactive, computed } from 'vue'

const state = reactive({
  todos: [],
  filter: 'all',
  nextId: 1,
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

  addTodo(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    state.todos.push({
      id: state.nextId++,
      text: trimmed,
      done: false,
    })
  },

  toggleTodo(id) {
    const todo = state.todos.find((t) => t.id === id)
    if (todo) {
      todo.done = !todo.done
    }
  },

  deleteTodo(id) {
    const index = state.todos.findIndex((t) => t.id === id)
    if (index !== -1) {
      state.todos.splice(index, 1)
    }
  },

  setFilter(filter) {
    state.filter = filter
  },

  clearCompleted() {
    state.todos = state.todos.filter((todo) => !todo.done)
  },
}
