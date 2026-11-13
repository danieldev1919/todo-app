<script setup>
import { store } from '../store'
import TodoInput from './TodoInput.vue'
import TodoList from './TodoList.vue'
import TodoFilters from './TodoFilters.vue'
import TodoFooter from './TodoFooter.vue'

function onAdd(text) {
  store.addTodo(text)
}

function onToggle(id) {
  store.toggleTodo(id)
}

function onDelete(id) {
  store.deleteTodo(id)
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
    />
    <TodoFilters />
    <TodoFooter />
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
}

.todo-title {
  text-align: center;
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
}
</style>
