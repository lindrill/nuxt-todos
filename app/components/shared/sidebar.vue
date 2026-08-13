<template>
    <div class="col-3 q-pa-md items-start q-mt-sm">
        <q-card class="my-card sidebar-card card-rounded">
            <q-card-section>
                <span class="text-white text-weight-bold q-mt-md sidebar-title-calendar">Calendar</span>
                <ClientOnly>
                    <VCalendar
                        expanded
                        color="yellow" 
                        transparent
                        borderless 
                        :is-dark="true"
                        :attributes="attributesTodo"
                        :masks="{ weekdays: 'WWW' }"
                        class="sidebar-calendar"
                    >
                    <template #day-popover="{ attributes }">
                        <div class="q-pa-sm">
                            <div v-for="attr in attributes" :key="attr.key">
                                <div v-for="(title, index) in attr.customData.titles" :key="index+'vcal'" class="text-caption">
                                    <q-badge size="xs" rounded :color="getStatusColor(attr.customData.status)" class="popover-dot q-mr-xs"/> {{ title }}
                                </div>
                            </div>
                        </div>
                    </template>
                    </VCalendar>
                </ClientOnly>

                <q-separator class="q-mb-md" color="blue-grey-10" />

                <div class="q-px-md sidebar-legend">
                    <span class="text-caption text-white text-weight-bold q-mr-sm">Legend : </span>
                    <div class="legend-indicators q-mr-md">
                        <q-badge rounded color="green" class="legend-badge"/>
                        <span class="text-caption text-white q-ml-xs">Completed</span>
                    </div>
                    <div class="legend-indicators q-mr-md">
                        <q-badge rounded color="amber-6" class="legend-badge"/>
                        <span class="text-caption text-grey-4 q-ml-xs">Pending</span>
                    </div>
                    <div class="legend-indicators q-mr-md">
                        <q-badge rounded color="red" class="legend-badge"/>
                        <span class="text-caption text-grey-4 q-ml-xs">Overdue</span>
                    </div>
                </div>
            </q-card-section>
        </q-card>
        <q-card class="my-card upcoming-task-card card-rounded q-mt-md">
            <q-card-section>
                <div class="q-pa-sm">
                    <q-list>
                        <q-item>
                            <q-item-section class="text-white text-weight-bold">Upcoming Tasks</q-item-section>
                        </q-item>
                        
                        <q-item
                            v-for="todo in upcomingTasks"
                            :key="'sidebar'+todo._id"
                            class="q-my-md"
                            flat
                            clickable
                            v-ripple
                        >
                            <q-item-section avatar>
                                <q-icon color="blue" size="22px" :name="'fa-solid fa-' + (todo.category?.icon || 'folder')" />
                            </q-item-section>

                            <q-item-section class="text-white text-weight-medium">
                                <q-item-label>{{ todo.title }}</q-item-label>
                                <q-item-label caption lines="1" class="text-blue-grey-4">{{ todo.category?.title || 'Uncategorized' }}</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <q-item-label caption class="text-grey-4" clickable>{{ taskDue(todo)?.date }}</q-item-label>
                                <q-item-label caption class="text-grey-4" clickable>{{ taskDue(todo)?.day }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import moment from 'moment'

    const props = defineProps(['todos', 'calendarAttributes'])

    // ===== METHODS =====
    const taskDue = (todo) => {
        let due = { date: moment.utc(todo.dueDate).format("MMM D"), day: moment.utc(todo.dueDate).format("ddd") }
        return due
    }
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'yellow'
            case 'completed':
                return 'green'
            default:
                return 'black'
        }
    }

    // ===== COMPUTED PROPERTIES =====

    const upcomingTasks = computed(() => {
        return props.todos.filter(todo => todo.status === 'pending').slice(0, 5)
    })

    const attributesTodo = computed(() => {
        const attrs = []
        props.calendarAttributes.forEach(item => {
            item.statuses.forEach(s => {
                attrs.push({
                    dates: item.date,
                    dot: {
                        color: getStatusColor(s.status),
                    },
                    popover: {
                        // label: s.titles.join(', '),
                        visibility: 'click'
                    },
                    customData: {
                        status: s.status,
                        titles: s.titles
                    },
                })
            })
        })
        return attrs
    })
</script>

<style scoped>

.sidebar-title {
    color: white;
}

.sidebar-title-calendar {
    display: block;
    width: 100%;
}

.sidebar-card, .upcoming-task-card {
    background-color: #152031;
    border: 1px solid #1d2837;
}

.sidebar-calendar {
    width: 100% !important;
}

.sidebar-legend span {
    font-size: 10px !important;
}

.legend-badge {
    width: 10px;
    height: 10px;
    min-height: 0;
    padding: 0;
}

.legend-indicators {
    display: inline-block;
}

.popover-dot {
    width: 5px;
    height: 5px;
    min-height: 0;
    padding: 0;
    display: inline-block;
    vertical-align: middle;
}

</style>
<style>

.sidebar-calendar {
    --vc-font-family: 'Poppins', sans-serif;
}

.sidebar-calendar .vc-header .vc-title {
    background-color: #152031 !important;
    font-weight: normal !important;
    font-size: 14px !important;
}

.sidebar-calendar .vc-header .vc-arrow {
    background-color: #152031 !important
}

button.vc-nav-item {
    background-color: #152031 !important;
    color: white;
    --vc-focus-ring: none;
}

.vc-popover-content.direction-bottom.vc-nav-popover-container.vc-yellow.vc-dark,
button.vc-nav-arrow.is-left.vc-focus,
button.vc-nav-arrow.is-right.vc-focus,
button.vc-nav-title.vc-focus {
    background-color: #152031 !important;
}

.vc-nav-item.is-active {
    color: black !important;
    background-color: #fbc122 !important;
}

.vc-nav-item:hover {
    background-color: #344b6b !important;
}

.vc-highlight-content-solid {
    color: black !important;
}

.vc-weekday {
    color: #90a4ae !important;
    font-weight: normal !important;
    font-size: 12px !important;
}

.vc-day-content {
    font-weight: normal !important;
    font-size: 14px !important;
}
</style>