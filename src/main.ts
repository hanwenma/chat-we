import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import App from './App.vue'
import { initSocket } from './socket'

import './assets/main.css'

initSocket('ws://192.168.1.2:3000')

const app = createApp(App)
app.use(router)
app.use(createPinia())

app.mount('#app')
