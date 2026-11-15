<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const text = ref('')
const priority = ref(false)

function onKeyup(event) {
  if (event.key === 'Enter' && text.value.trim()) {
    emit('add', { text: text.value, priority: priority.value })
    text.value = ''
    priority.value = false
  }
}
</script>

<template>
  <div class="todo-input-row">
    <input
      type="text"
      v-model="text"
      @keyup="onKeyup"
      placeholder="What needs to be done?"
      class="todo-input"
    />
    <label class="priority-label">
      <input
        type="checkbox"
        v-model="priority"
        class="priority-checkbox"
      />
      <span class="priority-icon">⚑</span>
    </label>
  </div>
</template>

<style scoped>
.todo-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.todo-input {
  flex: 1;
  padding: 14px 16px;
  font-size: 16px;
  border: 2px solid #30363d;
  border-radius: 10px;
  outline: none;
  background: #161b22;
  color: #c9d1d9;
  transition: border-color 0.2s;
}

.todo-input::placeholder {
  color: #484f58;
}

.todo-input:focus {
  border-color: #58a6ff;
}

.priority-label {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px 12px;
  border: 2px solid #30363d;
  border-radius: 10px;
  background: #161b22;
  transition: all 0.2s;
  min-width: 48px;
}

.priority-label:hover {
  border-color: #f85149;
}

.priority-checkbox {
  display: none;
}

.priority-icon {
  font-size: 20px;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.priority-checkbox:checked + .priority-icon {
  opacity: 1;
  color: #f85149;
}
</style>
