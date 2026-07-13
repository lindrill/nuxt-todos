<template>
    <div class="col-3 q-pa-md items-start q-mt-sm">
        <q-card class="my-card sidebar-card card-rounded">
            <q-card-section>
                <span class="text-white text-weight-bold q-mt-md">Calendar</span>
                <q-date
                    v-model="date"
                    :model-value="date"
                    minimal
                    flat
                    :navigation-min-year-month="minDate"
                    :navigation-max-year-month="maxDate"
                    color="amber"
                    text-color="white"
                    class="custom-calendar"
                />
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
                            v-for="activity in activities"
                            :key="'id_here'"
                            class="q-my-md"
                            flat
                            clickable
                            v-ripple
                        >
                            <q-item-section avatar>
                                <q-icon color="blue" size="22px" :name="'fa-solid fa-' + activity.icon" />
                            </q-item-section>

                            <q-item-section class="text-white">
                                <q-item-label>{{ activity.name }}</q-item-label>
                                <q-item-label caption lines="1" class="text-white">{{ activity.category }}</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <q-item-label caption class="text-grey-4" clickable>Jul 21</q-item-label>
                                <q-item-label caption class="text-grey-4" clickable>Sat</q-item-label>
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

    const date = ref('2026/06/20')
    const minDate = ref('2020/01')  // January 2020
    const maxDate = ref('2030/12')  // December 2030

    const activities = [
        {
            id: 1,
            icon: 'burger',
            name: 'Brunch this weekend',
            category: 'Vacation'
        },
            {
            id: 2,
            icon: 'wifi',
            name: 'Pay internet bill',
            category: 'Payments'
        },
            {
            id: 3,
            icon: 'hands-bubbles',
            name: 'Do the laundry',
            category: 'Chores'
        },
            {
            id: 4,
            icon: 'capsules',
            name: 'Buy headache medicine',
            category: 'Groceries'
        },
            {
            id: 5,
            icon: 'pizza-slice',
            name: 'Recipe to try',
            category: 'Chores'
        },
    ]
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

.custom-calendar {
    /* background-color: #2e384e; */
    background-color: #152031;
    color: white !important;
    width: 100%;
    margin-top: 10px;
    /* background-color: #3c4557; */
    /* border-radius: 8px; */
}

/* Selected date text color */
/* .custom-calendar :deep(.q-date__calendar-item--in .q-btn__content) {
    color: white !important;
} */
 
/* Or target the selected state more specifically */
.custom-calendar :deep(.q-btn.bg-amber .q-btn__content) {
    color: black !important;
}

/* .custom-calendar :deep(.q-date__header) {
    color: white !important;
} */

/* calendar dates */
/* .custom-calendar :deep(.q-date__calendar-item .q-btn) {
    color: white !important;
} */

/* .custom-calendar :deep(.q-date__calendar-weekdays) {
    color: white !important;
} */
</style>