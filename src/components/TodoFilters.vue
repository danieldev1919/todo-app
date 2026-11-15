<script setup>
import { computed } from 'vue'
import { store } from '../store'

const filters = ['all', 'active', 'completed']

const hasCompleted = computed(() => store.todos.some((todo) => todo.done))

function setFilter(filter) {
  store.setFilter(filter)
}

function clearCompleted() {
  store.clearCompleted()
}
</script>

<template>
  <div class="todo-filters">
    <button
      v-for="filter in filters"
      :key="filter"
      @click="setFilter(filter)"
      :class="{ active: store.filter === filter }"
      class="filter-btn"
    >
      {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
    </button>
    <button
      v-if="hasCompleted"
      @click="clearCompleted"
      class="filter-btn"
    >
      Clear completed
    </button>
  </div>
</template>

<style scoped>
.todo-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  padding: 16px 0 8px;
}

.filter-btn {
  padding: 8px 14px;
  border: 1px solid #30363d;
  border-radius: 20px;
  background: #161b22;
  cursor: pointer;
  font-size: 13px;
  color: #8b949e;
  transition: all 0.2s;
  min-height: 36px;
  min-width: 36px;
}

.filter-btn:hover {
  border-color: #58a6ff;
  color: #58a6ff;
}

.filter-btn.active {
  border-color: #58a6ff;
  background: rgba(88, 166, 255, 0.15);
  color: #58a6ff;
  font-weight: 600;
}
</style>
