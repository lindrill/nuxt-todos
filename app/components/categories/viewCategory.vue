<template>
    <q-card class="task-details category-view-card">
        <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
            <div class="text-h6">Category Details</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="cancelViewCategoryDialog" />
        </q-card-section>
        <q-card-section class="q-mx-md">
            <div class="row items-start">
                <div class="col-4 row items-center task-header-section q-mt-md">
                    <div class="form-icon-wrapper q-mr-md">
                        <q-icon :name="`fa-solid fa-${category?.icon}`" size="32px" color="amber-6" />
                    </div>
                    <div class="col">
                        <div class="text-body1">{{ category.title }}</div>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="col-8">
                    <div class="row q-col-gutter-sm">
                        <div class="col-4">
                            <div class="stat-card">
                                <div class="stat-number text-primary">{{ totalTodos }}</div>
                                <div class="stat-label">Total</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-card">
                                <div class="stat-number text-warning">{{ pendingCount }}</div>
                                <div class="stat-label">Pending</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-card">
                                <div class="stat-number text-positive">{{ completedCount }}</div>
                                <div class="stat-label">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <q-separator class="q-mt-lg" color="blue-grey-10" />
            <div v-if="todos.length > 0">
                <q-list>
                    <q-item class="q-pa-none q-ma-none">
                        <q-item-section>
                            <q-item-label overline class="text-white">TASKS</q-item-label>
                            <!-- <q-item-label>Single line item</q-item-label>
                            <q-item-label caption
                            >Secondary line text. Lorem ipsum dolor sit amet, consectetur
                            adipiscit elit.</q-item-label
                            > -->
                        </q-item-section>
                    </q-item>
                    <q-item class="todo-item q-my-sm todo-rounded" elevated
                        v-for="todo in todos" 
                        :key="'cat-'+category._id+'-todo-'+todo._id"
                    >
                        <!-- title -->
                        <q-item-section>
                            <q-item-label>{{ todo.title }} </q-item-label>
                            <div class="q-gutter-xs">
                                <q-chip  :text-color="getStatusTextColor(todo.status)" size="sm" class="q-px-sm q-mt-sm" :style="{ backgroundColor: getStatusBgColor(todo.status) }">
                                    <span class="text-weight-medium">{{ todo.status }}</span>
                                </q-chip>
                            </div>
                        </q-item-section>

                        <!-- due date -->
                        <q-item-section>
                            <div class="row items-center">
                                <q-icon name="fa-regular fa-calendar" color="grey-4" size="14px" class="q-mr-sm" />
                                {{ formatDate(todo.dueDate) }}
                            </div>
                        </q-item-section>

                        <!-- time -->
                        <q-item-section side>
                            <div class="row items-center">
                                <q-icon name="fa-regular fa-clock" text-color="grey-8" size="14px" class="q-mr-sm" />
                                {{ formatTime(todo.time) }}
                            </div>
                        </q-item-section>

                        <!-- creator -->
                        <q-item-section side>
                            <div class="q-gutter-xs">
                                <q-avatar color="deep-purple" text-color="white" size="28px" class="overlapping q-mt-none">
                                    {{ getNameInitials(todo.createdBy) }}
                                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">{{ getFullName(todo.createdBy) }}</q-tooltip>
                                </q-avatar>
                            </div>
                        </q-item-section>
                    </q-item>
                </q-list>
                <div class="q-py-lg flex item-start">
                    <q-pagination
                        gutter="md"
                        v-model="currentPage"
                        color="amber-6"
                        :max="maxPages"
                        direction-links
                        size="12px"
                    />
                </div>
            </div>
            <div class="q-px-sm" v-else>
                <q-card class="my-card bg-layer card-rounded no-data q-mt-lg" flat>
                    <p>No data available.</p>
                </q-card>
            </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
            <q-btn flat label="Close" color="amber-6" text-color="white" @click="cancelViewCategoryDialog"/>
        </q-card-actions>
    </q-card>
</template>

<script setup>
    import moment from 'moment'
    
    const { userInfo } = useAuth()
    const { fetch, apiBase } = useApi()
    const props = defineProps(['category'])
    const emit = defineEmits(['cancelViewCategoryDialog'])
    const todos = ref([])
    const currentPage = ref(1)
    const totalTodos = ref([])
    const pendingCount = ref(0)
    const completedCount = ref(0)
    const limit = ref(7) // todos pagination limit

    const cancelViewCategoryDialog = () => {
        emit('cancelViewCategoryDialog', false) 
    }

    const formatDate = (date) => {
        return moment(date).format('MMMM DD, YYYY')
    }
    const formatDay = (date) => {
        return moment(date).format('dddd')
    }
    const formatTime = (time) => {
        return moment(time, 'HH:mm').format('h:mm A'); 
    }
    const getStatusBgColor = (status) => {
        switch (status) {
            case 'pending':
                return '#1c2f4c'
            case 'completed':
                return '#1e3833'
            default:
                return 'grey-2'
        }
    }
    const getStatusTextColor = (status) => {
        switch (status) {
            case 'pending':
                return 'light-blue'
            case 'completed':
                return 'green'
            default:
                return 'black'
        }
    }
    const getNameInitials = (user) => {
        const name = user.first_name + ' ' + user.last_name
        return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
    }
    const getFullName = (user) => {
        if (!user) return 'Unknown'
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown'
    }
    const fetchTodosByCategory = async () => {
        try {
            const response = await fetch('/todos/by-category/'+props.category._id, { params: { userId: userInfo.value._id, skip: skip.value, limit: limit.value } })
            todos.value = response.todos
            totalTodos.value = response.total
            pendingCount.value = response.pendingCount
            completedCount.value = response.completedCount
        } catch (err) {
            console.error('Fetch category todos failed:', err)
        }
    }

    // ===== COMPUTED PROPERTIES =====
    const maxPages = computed(() => {
        return Math.ceil(totalTodos.value / limit.value)
    })
    const skip = computed(() => {
        return (currentPage.value - 1) * limit.value
    })

    onMounted(() => {
        fetchTodosByCategory()
    })

    // watch
    watch(currentPage, () => {
        fetchTodosByCategory()
    })
</script>

<style scoped>
label {
    font-size: 0.875rem;
}
.category-view-card {
    width: 700px !important;
    max-width: 700px !important;
    padding: 10px 20px 20px 20px;
    overflow: hidden;
}
/* .task-details .q-card__section {
    overflow-x: hidden;
} */
.todo-item {
    border: 1px solid #28303f;
    color: white;
}
.todo-rounded {
    border-radius: 10px;
}

/* .task-icon-wrapper {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 193, 7, 0.1);
} */
.task-details-separator {
    color: #29303f !important;
}
.info-section {
    display: flex;
    align-items: flex-start;
}
.info-icon-wrapper {
    width: 48px;
    height: 48px;
    background: rgba(33, 150, 243, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.stat-card {
    background-color: #1a2332;
    border: 1px solid #2a3442;
    border-radius: 8px;
    padding: 18px 12px;
    text-align: center;
}
.stat-number {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 8px;
}
.stat-label {
    font-size: 12px;
    color: #8b92a0;
    text-transform: capitalize;
}
.no-data p {
    color: white;
    text-align: center;
    padding: 10px;
    font-style: italic;
    font-size: 12px;
}
</style>