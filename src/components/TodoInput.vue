<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const text = ref('')

function onKeyup(event) {
  if (event.key === 'Enter' && text.value.trim()) {
    emit('add', text.value)
    text.value = ''
  }
}
</script>

<template>
  <input
    type="text"
    v-model="text"
    @keyup="onKeyup"
    placeholder="What needs to be done?"
    class="todo-input"
  />
</template>

<style scoped>
.todo-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.todo-input:focus {
  border-color: #42b883;
}
</style>
