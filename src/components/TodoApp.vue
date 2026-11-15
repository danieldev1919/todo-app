<script setup>
import { store } from '../store'
import TodoInput from './TodoInput.vue'
import TodoList from './TodoList.vue'
import TodoFilters from './TodoFilters.vue'
import TodoFooter from './TodoFooter.vue'

function onAdd(payload) {
  const text = typeof payload === 'string' ? payload : payload.text
  const priority = typeof payload === 'string' ? false : payload.priority
  store.addTodo(text, priority)
}

function onToggle(id) {
  store.toggleTodo(id)
}

function onDelete(id) {
  store.deleteTodo(id)
}

function onSetPriority(id) {
  const todo = store.todos.find((t) => t.id === id)
  if (todo) {
    store.setPriority(id, !todo.priority)
  }
}
</script>

<template>
  <div class="todo-app">
    <h1 class="todo-title">Todos</h1>
    <TodoInput @add="onAdd" />
    <TodoList
      :todos="store.filteredTodos"
      @toggle="onToggle"
      @delete="onDelete"
      @setpriority="onSetPriority"
    />
    <TodoFilters />
    <TodoFooter />
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100vh;
}

.todo-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #e6edf3;
  margin: 16px 0 24px;
  letter-spacing: -0.5px;
}

@media (min-width: 640px) {
  .todo-app {
    padding: 40px 20px;
  }

  .todo-title {
    font-size: 36px;
    margin: 24px 0 32px;
  }
}
</style>
