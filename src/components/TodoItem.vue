<script setup>
defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle', 'delete'])
</script>

<template>
  <li :class="{ completed: todo.done }">
    <input
      type="checkbox"
      :checked="todo.done"
      @change="emit('toggle', todo.id)"
      class="todo-checkbox"
    />
    <span class="todo-text">{{ todo.text }}</span>
    <button @click="emit('delete', todo.id)" class="todo-delete" aria-label="Delete">&times;</button>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 18px;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-delete {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
}

.todo-delete:hover {
  color: #e74c3c;
}
</style>
