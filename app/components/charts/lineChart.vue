<template>
  <div class="line-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
    import { Chart } from 'chart.js'
    import moment from 'moment'

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
            default: 'Tasks'
        },
        borderColor: {
            type: String,
            default: 'rgb(255, 193, 7)'
        },
        backgroundColor: {
            type: String,
            default: 'rgba(255, 193, 7, 0.2)'
        },
        statistics: {
            type: Array,
            default: () => []
        },
        date_type: {
            type: String,
            default: 'This Year'
        }
    })

    // ===== COMPUTED PROPERTIES =====
    const dataset = computed(() => {
        let labels = []
        let data = []
        let days = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun" }
        let daysInMonth = moment().daysInMonth();
        let monthsInYear = moment.monthsShort()

        if(props.date_type === 'This Year') { // This Year
            const statsMap = {}
            props.statistics.forEach((stat) => {
                statsMap[stat._id] = stat.count
            })

            for (let month = 1; month <= monthsInYear.length; month++) {
                labels.push(monthsInYear[month - 1])
                data.push(statsMap[monthsInYear[month - 1]] ?? 0)
            }
        } else if(props.date_type === 'This Month') { // This Month
            for (let day = 1; day <= daysInMonth; day++) {
                labels.push(day)
                props.statistics.forEach((stat) => {
                    if(stat._id == day) {
                        data.push(stat.count)
                    } else {
                        data.push(0)
                    }
                });
            }
        } else if(props.date_type === 'This Week') { // This Week

            const statsMap = {}
            props.statistics.forEach((stat) => {
                statsMap[stat._id] = stat.count
            })

            for (let day = 1; day <= 7; day++) {
                labels.push(days[day])
                data.push(statsMap[day] ?? 0)
            }

        } else { // Today

            const statsMap = {}
            props.statistics.forEach((stat) => {
                statsMap[stat._id] = stat.count
            })
        
            const formatHour = (hour) => {
                const period = hour >= 12 ? 'PM' : 'AM'
                let displayHour = hour % 12
                if (displayHour === 0) displayHour = 12
                return `${displayHour}${period}`
            }
        
            for (let hour = 0; hour <= 23; hour++) {
                labels.push(formatHour(hour))
                data.push(statsMap[String(hour).padStart(2, '0')] ?? 0)
            }
        }
        return { labels, data }
    })

    onMounted(() => {
        chartInstance = new Chart(chartCanvas.value, {
            type: 'line',
            data: {
            labels: dataset.value.labels,
            datasets: [{
                label: props.label,
                data: dataset.value.data,
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

    // watch
    watch(() => props.statistics, () => {
        if (!chartInstance) return
        chartInstance.data.labels = dataset.value.labels
        chartInstance.data.datasets[0].data = dataset.value.data
        chartInstance.update()
    })
</script>

<style scoped>
.line-chart-container {
  width: 100%;
  height: 100%;
}
</style>