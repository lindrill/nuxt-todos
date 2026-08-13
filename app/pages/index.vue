<template>
    <div class="page col-6">
        <div class="page-header row justify-between q-px-md q-mt-lg q-mb-sm">
            <div class="q-mb-md">
                <h5 class="page-title q-mt-md q-mb-none">Dashboard</h5>
                <span class="text-body2 text-white">Welcome back, {{ displayUserName }}! Here's what's happening today.</span>
            </div>
            <div>
                <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewTaskDialog = true">
                    <q-icon left size="1em" name="fa-solid fa-plus" />
                    <div>New Task</div>
                </q-btn>
            </div>
        </div>
        <div class="row justify-start q-px-md q-mb-lg dashboard-filters">
            <q-select
                outlined
                v-model="selectedDate"
                :options="dateRange"
                emit-value
                map-options
                dense
                style="width: 180px;"
                @update:model-value="onDateSelectChange"
                >
                <template v-slot:prepend>
                    <q-icon name="fa-solid fa-calendar-days" size="18px" color="white" text-color="white" class="q-mr-sm" />
                </template>
            </q-select>
            <q-select
                v-if="isAdmin"
                outlined
                v-model="selectedUser"
                :options="users"
                dense
                option-value="_id" 
                :option-label="(user) => getFullName(user)"
                style="width: 250px;"
                @update:model-value="onUserSelectChange"
                class="q-ml-sm"
                >
                <template v-slot:prepend>
                    <q-icon name="fa-solid fa-filter" size="18px" color="white" text-color="white" />
                </template>
            </q-select>
        </div>
        <div class="row justify-between q-px-md">
            <q-card class="my-card col-6 dashboard-stat text-white card-rounded q-col-gutter-sm">
                <q-card-section class="q-pb-none">
                    <div class="row flex-center">
                        <div class="col-9">
                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon left color="amber-6" name="fa-regular fa-calendar-check" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label class="text-weight-bold text-subtitle1">{{ todosCount.completed }} {{ todosCount.completed === 1 ? 'Task' : 'Tasks' }}</q-item-label>
                                        <q-item-label class="text-caption" lines="2">Completed</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                        <div class="col-3">
                            <q-circular-progress
                                show-value
                                class="text-green q-ma-md"
                                :value="getCompletedPercentage"
                                size="60px"
                                color="green"
                                track-color="grey"
                                :thickness="0.15"
                            >{{ getCompletedPercentage }}%</q-circular-progress>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
            <q-card class="my-card col-6 dashboard-stat text-white card-rounded q-col-gutter-sm">
                <q-card-section class="q-pb-none">
                    <div class="row flex-center">
                        <div class="col-9">
                            <q-list>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-icon left color="amber-6" name="fa-solid fa-hourglass-half" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label class="text-weight-bold text-subtitle1">{{ todosCount.pending }} {{ todosCount.pending === 1 ? 'Task' : 'Tasks' }}</q-item-label>
                                        <q-item-label class="text-caption" lines="2">Pending</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                        <div class="col-3">
                            <q-circular-progress
                                show-value
                                class="text-purple q-ma-md"
                                :value="getPendingPercentage"
                                size="60px"
                                color="purple"
                                track-color="grey"
                                :thickness="0.15"
                            >{{ getPendingPercentage }}%</q-circular-progress>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
        <!-- Chart -->
        <div class="q-px-sm q-my-lg">
            <q-card class="my-card card-rounded dashboard-stat">
                <q-card-section>
                    <div class="">
                        <ChartsLineChart :statistics="chartStats" :date_type="selectedDate"/>
                    </div>
                </q-card-section>
            </q-card>
        </div>
        <!-- Categories -->
        <div class="q-px-sm q-my-lg">
            <q-card class="my-card dashboard-stat card-rounded">
                <q-card-section>
                    <div class="categories-container">
                        <div class="categories-header row justify-between items-center q-mb-lg">
                            <span class="text-subtitle1 text-white">Categories</span>
                            <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewCategoryDialog = true">
                                <q-icon left size="1em" name="fa-solid fa-plus"/>
                                <span>New Category</span>
                            </q-btn>
                        </div>
                        <div class="row q-col-gutter-lg">
                            <div v-for="category in categoriesList" :key="category._id.category" class="col-3">
                                <q-card class="category-card card-rounded text-center">
                                    <q-card-section class="q-py-lg">
                                        <q-icon :name="'fa-solid fa-'+category._id.icon" size="1.5rem" color="white" class="q-mb-sm"/>
                                        <div class="text-caption text-weight-medium text-amber-6">{{ category._id.category }}</div>
                                        <div class="text-white text-caption">{{ category.count }} {{ category.count === 1 ? 'task' : 'tasks' }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-center q-mt-md">
                        <q-btn color="amber-6" text-color="grey-10" rounded flat>
                            <span class="text-amber-6 view-cat-btn" @click="viewAllCategories">View all categories</span>
                            <q-icon right size="1em" name="fa-solid fa-angle-right" color="amber-6"/>
                        </q-btn>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
    <q-dialog v-model="openNewTaskDialog" backdrop-filter="blur(4px)" persistent>
        <TasksNewTask :categories="categories" @cancelNewTaskDialog="cancelNewTaskDialog" @saveNewTodo="saveNewTodo"/>
    </q-dialog>
    <q-dialog v-model="openNewCategoryDialog" backdrop-filter="blur(4px)" persistent>
        <CategoriesNewCategory @cancelNewCategoryDialog="cancelNewCategoryDialog" @saveNewCategory="saveNewCategory"/>
    </q-dialog>
    <q-dialog v-model="openAllCategoriesDialog" backdrop-filter="blur(4px)" persistent>
        <DashboardCategoriesDialog :categories="categories" @cancelViewCategoryDialog="cancelViewCategoryDialog"/>
    </q-dialog>
</template>

<script setup>
    import { useQuasar } from 'quasar'
    import moment from 'moment'
    
    // ===== REACTIVE VARIABLES =====
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const { userInfo, isAuthenticated } = useAuth()

    const openNewTaskDialog = ref(false)
    const openNewCategoryDialog = ref(false)
    const openAllCategoriesDialog = ref(false)
    const categories = ref([])
    const selectedDate = ref('This Year')
    const startDate = ref(moment().startOf('year').format('YYYY-MM-DD'))
    const endDate = ref(moment().endOf('year').format('YYYY-MM-DD'))
    const selectedUser = ref(null)
    const dateRange = ref(['This Year', 'This Month', 'This Week', 'Today'])
    const todosCount = ref({ total: 0, pending: 0, completed: 0 })
    const todos = ref([])
    const calendarAttributes = ref([])
    const chartStats = ref([])
    const users = ref([])
    const onDateSelectChange = (date) => {
        console.log('date', date)
        selectedDate.value = date
        switch (date) {
            case 'This Year':
                startDate.value = moment().startOf('year').format('YYYY-MM-DD')
                endDate.value = moment().endOf('year').format('YYYY-MM-DD')
                console.log('year')
                break;
            case 'This Month':
                startDate.value = moment().startOf('month').format('YYYY-MM-DD')
                endDate.value = moment().endOf('month').format('YYYY-MM-DD')
                console.log('month')
                break;
            case 'This Week':
                startDate.value = moment().startOf('week').format('YYYY-MM-DD')
                endDate.value = moment().endOf('week').format('YYYY-MM-DD')
                break;
            case 'Today':
                startDate.value = moment().startOf('day').format('YYYY-MM-DD')
                endDate.value = moment().endOf('day').format('YYYY-MM-DD')
                break;
            default:
                startDate.value = moment().startOf('year').format('YYYY-MM-DD')
                endDate.value = moment().endOf('year').format('YYYY-MM-DD')
        }
        console.log('onDateSelectChange', startDate.value, endDate.value)
        fetchTodosCount()
    }
    const onUserSelectChange = (user) => {
        selectedUser.value = user
        fetchTodosCount()
    }

    // ===== METHODS =====
    const cancelNewTaskDialog = (cancelNewTaskDialog) => {
        openNewTaskDialog.value = cancelNewTaskDialog
    }
    const cancelNewCategoryDialog = (cancelNewCategoryDialog) => {
        openNewCategoryDialog.value = cancelNewCategoryDialog
    }
    const cancelViewCategoryDialog = (cancelViewCategoryDialog) => {
        openAllCategoriesDialog.value = cancelViewCategoryDialog
    }
    const saveNewTodo = () => {
        openNewTaskDialog.value = false
        notification('positive', 'Task successfully saved!')
        fetchTodosCount()
    }
    const saveNewCategory = () => {
        openNewCategoryDialog.value = false
        notification('positive', 'Category successfully saved!')
        fetchCategories()
    }
    const getFullName = (user) => {
        if (user._id == 'All') {
            return 'All'
        }
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown'
    }
    const viewAllCategories = () => {
        openAllCategoriesDialog.value = true
    }
    
    // API calls
    const fetchCategories = async () => {
        try {
            const response = await fetch('/categories/all', { params: { userId: userInfo.value._id } })
            console.log('fetch cats', response)
            categories.value = response
        } catch (err) {
            console.error('Fetch failed:', err)
        }
    }
    const fetchUsers = async () => {
        try {
            const response = await fetch('/users/all')
            users.value = response
            let allOption = { _id: 'All', last_name: 'All', first_name: '' };
            users.value.unshift(allOption);
            selectedUser.value = users.value[0]
        } catch (err) {
            console.error('Fetch users failed:', err)
        }
    }
    const fetchTodosCount = async () => {
        try {
            let user_id = userInfo.value._id
            if(isAdmin.value) {
                user_id = selectedUser.value ? selectedUser.value._id : 'All'
            }
            const response = await fetch('/todos/statistics', { params: { userId: user_id, date_type: selectedDate.value, start_date: startDate.value, end_date: endDate.value } })
            todosCount.value.total = response.total
            todosCount.value.pending = response.pendingCount
            todosCount.value.completed = response.completedCount
            chartStats.value = response.chartStats
            categories.value = response.categories
        } catch (err) {
            console.error('Fetch failed:', err)
        }
    }
    const fetchTodos = async () => {
        try {
            const response = await fetch('/todos/all', { params: { userId: userInfo.value._id, keyword: '' } })
            todos.value = response.todos
            calendarAttributes.value = response.calendarAttributes
        } catch (err) {
            console.error('Fetch failed:', err)
        }
    }
    
    // ===== COMPUTED PROPERTIES =====
    const displayUserName = computed(() => {
        return userInfo.value?.first_name || 'User'
    })
    const isAdmin = computed(() => {
        if(userInfo.value && userInfo.value.role === 'admin') {
            return true
        }
        return false
    })
    const getCompletedPercentage = computed(() => {
        return Math.round((todosCount.value.completed / todosCount.value.total) * 100) || 0
    })
    const getPendingPercentage = computed(() => {
        return Math.round((todosCount.value.pending / todosCount.value.total) * 100) || 0
    })
    const categoriesList = computed(() => {
        return categories.value.slice(0, 4);
    })

    // ===== LIFECYCLE HOOKS =====
    onMounted(() => {
        fetchTodos()
        fetchUsers()
        fetchCategories()
        fetchTodosCount()
    })

</script>

<style scoped>
.category-card {
    background-color: #0e1827 !important;
    border: 1px solid #1d2837;
}
.dashboard-filters {
    margin-bottom: 35px;
}
.dashboard-stat {
    background-color: #152031;
    border: 1px solid #1d2837;
}
.view-cat-btn {
    text-transform: none !important;
}
</style>
<style>
.category-card {
    background-color: #0e1827 !important;
    border: 1px solid #1d2837;
}
.dashboard-filters .q-select .q-field__append .q-icon{
    color: #ffffff !important;
}
.dashboard-filters .q-select .q-field__native {
    color: #ffffff !important;
}
.dashboard-filters .q-field--outlined .q-field__control:hover:before {
    border-color: #7a909c !important;
    border-width: 1px !important;
}
.dashboard-filters .q-field--outlined .q-field__control:after {
    border-color: #7a909c !important;
    border-width: 1px !important;
}
</style>