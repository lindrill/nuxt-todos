<template>
    <div class="col-3 q-pa-md items-start q-mt-sm">
        <q-card class="my-card sidebar-card card-rounded">
            <q-card-section>
                <span class="text-white text-weight-bold q-mt-md">Calendar</span>
                <ClientOnly>
                    <VCalendar
                        color="yellow"
                        transparent 
                        borderless 
                        :is-dark="true"
                        :attributes="calendarEvents"
                    />
                </ClientOnly>
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
                            v-for="todo in todos"
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

    const props = defineProps(['todos', 'pendingDates', 'completedDates'])

    // ===== METHODS =====
    const taskDue = (todo) => {
        let due = { date: moment.utc(todo.dueDate).format("MMM D"), day: moment.utc(todo.dueDate).format("ddd") }
        return due
    }

    // ===== COMPUTED PROPERTIES =====
    const countPendingDates = computed(() => {
        const counts = {}
        props.pendingDates.forEach(date => {
            const key = moment.utc(date).format('YYYY-MM-DD') // normalize so same-day dates group together
            counts[key] = (counts[key] || 0) + 1
        })
        return Object.entries(counts).map(([date, count]) => ({ date, count }))
    })

    const countCompletedDates = computed(() => {
        const counts = {}
        props.completedDates.forEach(date => {
            const key = moment.utc(date).format('YYYY-MM-DD') // normalize so same-day dates group together
            counts[key] = (counts[key] || 0) + 1
        })
        return Object.entries(counts).map(([date, count]) => ({ date, count }))
    })

    const calendarEvents = computed(() => {
        let dots = [
            {
                dot: true,
                dates: countPendingDates.value.map(item => item.date)
            },
            {
                dot: 'green',
                dates: countCompletedDates.value.map(item => item.date)
            }
        ]
        return dots
    })

    // ===== LIFECYCLE HOOKS =====
    onMounted(() => {
        console.log('pending count', countPendingDates.value)
    })
</script>

<style scoped>

.sidebar-title {
    color: white;
}

.sidebar-card, .upcoming-task-card {
    background-color: #152031;
    border: 1px solid #1d2837;
    /* min-height: 100dvh; */
}

/* .custom-calendar {
    background-color: #152031;
    color: white !important;
    width: 100%;
    margin-top: 10px;
} */
 
/* Or target the selected state more specifically */
/* .custom-calendar :deep(.q-btn.bg-amber .q-btn__content) {
    color: black !important;
} */

</style>