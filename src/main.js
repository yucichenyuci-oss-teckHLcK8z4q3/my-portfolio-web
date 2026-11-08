import { createApp } from 'vue'
import App from './App.vue'
import { installDeterrents } from './protect.js'
import './style.css'

installDeterrents()
createApp(App).mount('#app')
