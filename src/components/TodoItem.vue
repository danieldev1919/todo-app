<script setup>
defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle', 'delete', 'setpriority'])
</script>

<template>
  <li :class="{ completed: todo.done, 'high-priority': todo.priority }">
    <input
      type="checkbox"
      :checked="todo.done"
      @change="emit('toggle', todo.id)"
      class="todo-checkbox"
    />
    <span class="todo-text">{{ todo.text }}</span>
    <button
      @click="emit('setpriority', todo.id)"
      :class="{ 'priority-active': todo.priority }"
      class="priority-btn"
      :aria-label="todo.priority ? 'Remove priority' : 'Add priority'"
    >
      ⚑
    </button>
    <button @click="emit('delete', todo.id)" class="todo-delete" aria-label="Delete">&times;</button>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  border-bottom: 1px solid #21262d;
  background: #161b22;
  transition: background 0.15s;
}

li:first-child {
  border-radius: 10px 10px 0 0;
}

li:last-child {
  border-radius: 0 0 10px 10px;
  border-bottom: none;
}

li:hover {
  background: #1c2129;
}

.high-priority {
  border-left: 3px solid #f85149;
  padding-left: 9px;
}

.todo-checkbox {
  width: 22px;
  height: 22px;
  cursor: pointer;
  accent-color: #58a6ff;
  flex-shrink: 0;
}

.todo-text {
  flex: 1;
  font-size: 16px;
  color: #c9d1d9;
  line-height: 1.4;
  word-break: break-word;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #484f58;
}

.priority-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
  opacity: 0.3;
  transition: all 0.2s;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
}

.priority-btn:hover {
  opacity: 0.7;
}

.priority-active {
  opacity: 1;
  color: #f85149;
}

.todo-delete {
  background: none;
  border: none;
  font-size: 20px;
  color: #484f58;
  cursor: pointer;
  padding: 6px;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  border-radius: 6px;
  transition: all 0.15s;
}

.todo-delete:hover {
  color: #f85149;
  background: rgba(248, 81, 73, 0.1);
}
</style>
