<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  todos: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['toggle', 'delete'])
</script>

<template>
  <ul v-if="todos.length" class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="emit('toggle', $event)"
      @delete="emit('delete', $event)"
    />
  </ul>
</template>

<style scoped>
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
