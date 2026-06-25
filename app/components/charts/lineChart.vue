<template>
  <div class="line-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { Chart } from 'chart.js'

const chartCanvas = ref(null)
let chartInstance = null

const props = defineProps({
    labels: {
        type: Array,
        default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    data: {
        type: Array,
        default: () => [3, 2, 3, 2, 1, 1, 0]
    },
    label: {
        type: String,
        default: 'Tasks Completed'
    },
    borderColor: {
        type: String,
        default: 'rgb(255, 193, 7)'
    },
    backgroundColor: {
        type: String,
        default: 'rgba(255, 193, 7, 0.2)'
    }
})

onMounted(() => {
    chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: {
        labels: props.labels,
        datasets: [{
            label: props.label,
            data: props.data,
            borderColor: props.borderColor,
            backgroundColor: props.backgroundColor,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    })
})

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy()
    }
})
</script>

<style scoped>
.line-chart-container {
  width: 100%;
  height: 100%;
}
</style>