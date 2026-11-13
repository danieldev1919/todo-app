<script setup>
import { store } from '../store'

const filters = ['all', 'active', 'completed']

function setFilter(filter) {
  store.setFilter(filter)
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
  </div>
</template>

<style scoped>
.todo-filters {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 12px 0;
}

.filter-btn {
  padding: 6px 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #42b883;
  color: #42b883;
}

.filter-btn.active {
  border-color: #42b883;
  background: #42b883;
  color: white;
}
</style>
