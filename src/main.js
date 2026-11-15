import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'

store.init().then(() => {
  createApp(App).mount('#app')
})
