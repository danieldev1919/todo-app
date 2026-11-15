import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { store } from '../store'

// Track next ID for mock responses
let nextMockId = 1

function mockFetch() {
  return vi.fn((url, options) => {
    const urlStr = String(url)
    const todos = store.todos

    if (urlStr.endsWith('/todos') && (!options || options.method === 'GET')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(todos.slice()),
      })
    }

    if (urlStr.endsWith('/todos') && options?.method === 'POST') {
      const body = JSON.parse(options.body)
      const newTodo = {
        id: nextMockId++,
        text: body.text.trim(),
        done: false,
        priority: body.priority || false,
      }
      // Don't push here — the store will push the response
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newTodo),
      })
    }

    if (options?.method === 'PUT' && urlStr.includes('/todos/')) {
      const id = parseInt(urlStr.split('/').pop())
      const body = JSON.parse(options.body)
      const todo = todos.find((t) => t.id === id)
      if (todo) {
        if (body.done !== undefined) todo.done = body.done
        if (body.priority !== undefined) todo.priority = body.priority
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(todo),
      })
    }

    if (options?.method === 'DELETE' && urlStr.includes('/todos/')) {
      const id = parseInt(urlStr.split('/').pop())
      const index = todos.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.splice(index, 1)
      }
      return Promise.resolve({
        ok: true,
      })
    }

    return Promise.resolve({ ok: false })
  })
}

describe('App', () => {
  beforeEach(() => {
    // Reset store state
    store.resetForTest()
    nextMockId = 1

    // Mock fetch for API calls
    global.fetch = mockFetch()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Todos')
  })

  it('adds a todo via input', async () => {
    const wrapper = mount(App)
    const input = wrapper.find('.todo-input')
    await input.setValue('New task')
    await input.element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }))
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(store.todos.length).toBe(1)
    expect(store.todos[0].text).toBe('New task')
  })

  it('toggles a todo', async () => {
    const wrapper = mount(App)
    await store.addTodo('Task 1')
    await wrapper.vm.$nextTick()

    expect(store.todos[0].done).toBe(false)
    await store.toggleTodo(store.todos[0].id)
    await wrapper.vm.$nextTick()
    expect(store.todos[0].done).toBe(true)
  })

  it('deletes a todo', async () => {
    const wrapper = mount(App)
    await store.addTodo('Task 1')
    await wrapper.vm.$nextTick()

    await store.deleteTodo(store.todos[0].id)
    await wrapper.vm.$nextTick()
    expect(store.todos.length).toBe(0)
  })

  it('clears completed todos when "Clear completed" button is clicked', async () => {
    const wrapper = mount(App)

    await store.addTodo('Task 1')
    await store.addTodo('Task 2')
    await store.addTodo('Task 3')
    await wrapper.vm.$nextTick()

    const ids = store.todos.map(t => t.id)
    await store.toggleTodo(ids[0])
    await store.toggleTodo(ids[2])
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

  it('does not show "Clear completed" button when no todos are completed', async () => {
    const wrapper = mount(App)
    await store.addTodo('Task 1')
    await store.addTodo('Task 2')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('Clear completed')
  })

  it('adds a todo with priority', async () => {
    const wrapper = mount(App)
    const input = wrapper.find('.todo-input')
    const priorityCheckbox = wrapper.find('.priority-checkbox')

    await priorityCheckbox.setValue(true)
    await input.setValue('Urgent task')
    await input.element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }))
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(store.todos.length).toBe(1)
    expect(store.todos[0].priority).toBe(true)
  })

  it('toggles priority on a todo', async () => {
    const wrapper = mount(App)
    await store.addTodo('Task 1', true)
    await wrapper.vm.$nextTick()

    expect(store.todos[0].priority).toBe(true)
    await store.setPriority(store.todos[0].id, false)
    await wrapper.vm.$nextTick()
    expect(store.todos[0].priority).toBe(false)
  })
})
