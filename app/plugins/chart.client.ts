import { Chart, registerables } from 'chart.js'

export default defineNuxtPlugin(() => {
  // Register all Chart.js components globally
  Chart.register(...registerables)

  // Optional: Set global defaults
  Chart.defaults.font.family = 'inherit'
  Chart.defaults.color = '#fff'
  Chart.defaults.plugins.legend.display = true

  return {
    provide: {
      Chart
    }
  }
})