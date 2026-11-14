import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { store } from '../store'

describe('App', () => {
  beforeEach(() => {
    while (store.todos.length > 0) {
      store.deleteTodo(store.todos[0].id)
    }
    store.setFilter('all')
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Todos')
  })

  it('clears completed todos when "Clear completed" button is clicked', async () => {
    const wrapper = mount(App)

    store.addTodo('Task 1')
    store.addTodo('Task 2')
    store.addTodo('Task 3')
    await wrapper.vm.$nextTick()

    store.toggleTodo(1)
    store.toggleTodo(3)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Clear completed')
    const buttons = wrapper.findAll('.filter-btn')
    const clearButtonIndex = buttons.findIndex(btn => btn.text() === 'Clear completed')
    expect(clearButtonIndex).toBeGreaterThanOrEqual(0)
    await buttons[clearButtonIndex].trigger('click')
    await wrapper.vm.$nextTick()

    expect(store.todos.length).toBe(1)
    expect(store.todos[0].text).toBe('Task 2')
    expect(store.todos[0].done).toBe(false)
  })

  it('does not show "Clear completed" button when no todos are completed', () => {
    const wrapper = mount(App)
    store.addTodo('Task 1')
    store.addTodo('Task 2')
    expect(wrapper.text()).not.toContain('Clear completed')
  })
})
