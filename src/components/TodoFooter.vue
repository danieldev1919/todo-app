<script setup>
import { store } from '../store'
</script>

<template>
  <div class="todo-footer" v-if="store.todos.length">
    <span class="items-left">
      {{ store.todosRemaining }} {{ store.todosRemaining === 1 ? 'item' : 'items' }} left
    </span>
  </div>
</template>

<style scoped>
.todo-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  font-size: 14px;
  color: #999;
}

.items-left {
  font-weight: 500;
}
</style>
