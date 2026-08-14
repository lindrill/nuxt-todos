<template>
    <div class="page col-6">
        <div class="page-header row justify-between q-px-md q-mt-lg q-mb-lg">
            <div>
                <h6 class="page-title q-mt-md q-mb-none">Todos</h6>
                <span class="text-body2 text-white">Stay organized and get things done.</span>
            </div>
            <div>
                <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewTaskDialog = true">
                    <q-icon left size="1em" name="fa-solid fa-plus" />
                    <div>New Task</div>
                </q-btn>
            </div>
        </div>
        <div class="q-px-md">
            <!-- Tabs/Filters -->
            <div class="q-mt-md q-mb-lg todo-filters todo-item todo-rounded">
                <div class="row justify-between items-center">
                    <q-tabs
                        v-model="activeTab"
                        dense
                        class="text-white"
                        active-color="amber-6"
                        indicator-color="amber-6"
                        align="left"
                    >
                        <q-tab v-for="tab in tabs" :name="tab.name" class="tab-item q-pa-md q-px-lg">
                            <div class="row items-center">
                                <span>{{ tab.label }}</span>
                                <q-chip 
                                    size="md" 
                                    dense
                                    :style="{ backgroundColor: getTabChipColor(tab.name) }" 
                                    :text-color="getTabChipTextColor(tab.name)"
                                    class="q-ml-sm text-weight-bold custom-chip-size"
                                >
                                    {{ getTodoCount(tab.name) }}
                                </q-chip>
                            </div>
                        </q-tab>
                    </q-tabs>
                    
                    <q-input
                        v-model="searchQuery"
                        dense
                        dark
                        outlined 
                        standout="bg-grey-9"
                        placeholder="Search tasks..."
                        class="search-input q-px-md"
                        style="width: 250px;"
                        debounce="500"
                    >
                        <template v-slot:append>
                            <q-icon name="search" color="grey-4" />
                        </template>
                    </q-input>
                </div>
            </div>
            <!-- Tasks -->
            <div v-if="todos.length > 0">
                <q-list>
                    <q-item class="todo-item q-my-sm todo-rounded" 
                        v-for="todo in todos" 
                        :key="todo._id" 
                        clickable
                        v-ripple
                        @click="todoActions('view', todo)"
                    >
                        <!-- checkbox -->
                        <q-item-section avatar top @click.stop>
                            <q-checkbox dark
                                :model-value="todo.status == 'completed'" 
                                @update:model-value="markComplete(todo)"
                            />
                        </q-item-section>

                        <!-- category -->
                        <q-item-section avatar>
                            <q-icon v-if="todo.category" :name="`fa-solid fa-${todo.category?.icon}`" color="amber-6" size="18px">
                                <q-tooltip class="bg-amber-6 text-black" :offset="[10, 10]">{{ todo.category?.title }}</q-tooltip>
                            </q-icon>
                        </q-item-section>
                        
                        <!-- title -->
                        <q-item-section>
                            <q-item-label>{{ todo.title }} </q-item-label>
                        </q-item-section>
                            
                        <!-- status -->
                        <q-item-section>
                            <div class="q-gutter-xs">
                                <q-chip  :text-color="getStatusTextColor(todo.status)" size="sm" class="q-px-sm q-ml-xs" :style="{ backgroundColor: getStatusBgColor(todo.status) }">
                                    <span class="text-weight-medium">{{ todo.status }}</span>
                                </q-chip>
                            </div>
                        </q-item-section>

                        <!-- due date -->
                        <q-item-section class="col-2">
                            <div class="row items-center text-blue-grey-4">
                                <q-icon name="fa-regular fa-calendar" size="14px" class="q-mr-sm" />
                                {{ formatDate(todo.dueDate) }}
                            </div>
                        </q-item-section>

                        <!-- time -->
                        <q-item-section class="col-2">
                            <div class="row items-center text-blue-grey-4">
                                <q-icon name="fa-regular fa-clock" size="14px" class="q-mr-sm" />
                                {{ formatTime(todo.time) }}
                            </div>
                        </q-item-section>

                        <!-- creator -->
                        <q-item-section class="col-1">
                            <div class="q-gutter-xs">
                                <q-avatar color="deep-purple" text-color="white" size="28px" class="overlapping q-mt-none">
                                    {{ getNameInitials(todo.createdBy) }}
                                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">{{ getFullName(todo.createdBy) }}</q-tooltip>
                                </q-avatar>
                            </div>
                        </q-item-section>
                        
                        <!-- actions -->
                        <q-item-section side @click.stop>
                            <div class="text-grey-8 q-gutter-xs">
                                <q-btn-dropdown size="12px" dense flat unelevated color="grey-4" text-color="grey-5" dropdown-icon="more_vert" class="btn-action q-ml-xs">
                                    <q-list class="todo-action-dropdown">
                                        <q-item clickable v-close-popup @click="todoActions('view', todo)">
                                            <div class="q-mr-md action-dropdown-wrapper">
                                                <q-icon name="fa-solid fa-eye" text-color="white" size="2em" color="amber-7" />
                                            </div>
                                            
                                            <q-item-section>
                                                <q-item-label>View Details</q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-separator color="blue-grey-10" />

                                        <q-item clickable v-close-popup @click="todoActions('edit', todo)">
                                            <div class="q-mr-md action-dropdown-wrapper">
                                                <q-icon name="fa-solid fa-pen-to-square" text-color="white" size="2em" color="green" />
                                            </div>
                                            <q-item-section>
                                                <q-item-label>Edit Task</q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-separator color="blue-grey-10" />

                                        <q-item clickable v-close-popup @click="todoActions('delete', todo)">
                                            <div class="q-mr-md action-dropdown-wrapper">
                                                <q-icon name="fa-regular fa-trash-can" text-color="white" size="2em" color="red" />
                                            </div>
                                            <q-item-section>
                                                <q-item-label>Delete Task</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-btn-dropdown>
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
                <q-card class="my-card bg-layer card-rounded no-data" flat>
                    <p>No data available.</p>
                </q-card>
            </div>
        </div>
    </div>
    <div>
        <q-dialog v-model="openNewTaskDialog" backdrop-filter="blur(4px)" persistent>
            <TasksNewTask :categories="categories" @cancelNewTaskDialog="cancelNewTaskDialog" @saveNewTodo="saveNewTodo"/>
        </q-dialog>
        <q-dialog v-model="openDeleteDialog" backdrop-filter="blur(4px)" persistent>
            <ReusablesDeleteDialog :item="todo" :table="'todos'" @cancelDeleteDialog="cancelDeleteDialog" @deleteItem="deleteTodo"/>
        </q-dialog>
        <q-dialog v-model="openEditTaskDialog" backdrop-filter="blur(4px)" persistent>
            <TasksEditTask :todo="todo" :categories="categories" @cancelEditTaskDialog="cancelEditTaskDialog" @updateTodo="updateTodo"/>
        </q-dialog>
        <q-dialog v-model="openViewTaskDialog" backdrop-filter="blur(4px)" persistent>
            <TasksViewTask :todo="todo" @cancelViewTaskDialog="cancelViewTaskDialog"/>
        </q-dialog>
    </div>
</template>
<script setup>
    import { useQuasar } from 'quasar'
    import moment from 'moment'
    const { fetchSidebarData } = useSidebarData()
    
    // ===== REACTIVE VARIABLES =====
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const { userInfo } = useAuth()

    const openNewTaskDialog = ref(false)
    const openDeleteDialog = ref(false)
    const openEditTaskDialog = ref(false)
    const openViewTaskDialog = ref(false)
    const todos = ref([])
    const todo = ref([])
    const modelValue = ref(false)
    const currentPage = ref(1)
    const totalTodos = ref([])
    const limit = ref(10) // todos pagination limit
    const categories = ref([])
    const activeTab = ref('pending')
    const searchQuery = ref('')
    const tabs = ref([
        { name: 'pending', label: 'Pending' },
        { name: 'completed', label: 'Completed' },
        { name: 'all', label: 'All' }
    ])
    const pendingCount = ref(0)
    const completedCount = ref(0)
    

    // ===== METHODS =====
    const cancelNewTaskDialog = (cancelNewTaskDialog) => {
        openNewTaskDialog.value = cancelNewTaskDialog
    }
    const cancelDeleteDialog = (cancelDeleteDialog) => {
        openDeleteDialog.value = cancelDeleteDialog
    }
    const cancelEditTaskDialog = (cancelEditTaskDialog) => {
        openEditTaskDialog.value = cancelEditTaskDialog
    }
    const cancelViewTaskDialog = (cancelViewTaskDialog) => {
        openViewTaskDialog.value = cancelViewTaskDialog
    }
    const saveNewTodo = () => {
        openNewTaskDialog.value = false
        fetchTodos()
        fetchSidebarData()
    }
    const todoActions = (action, selectedTodo) => {
        todo.value = selectedTodo
        if(action == "edit") {
            openEditTaskDialog.value = true
        } else if(action == "delete") {
            openDeleteDialog.value = true
        } else if(action == "view") {
            openViewTaskDialog.value = true
        }
    }
    const deleteTodo = () => {
        openDeleteDialog.value = false
        notification('positive', 'Task successfully deleted!')
        fetchTodos()
        fetchSidebarData()
    }
    const updateTodo = () => {
        openEditTaskDialog.value = false
        notification('positive', 'Task successfully updated!')
        fetchTodos()
        fetchSidebarData()
    }
    
    // API calls
    const fetchTodos = async () => {
        try {
            const response = await fetch('/todos/all', { params: { userId: userInfo.value._id, skip: skip.value, limit: limit.value, keyword: searchQuery.value, status: activeTab.value } })
            todos.value = response.todos
            totalTodos.value = response.total
            pendingCount.value = response.pendingCount
            completedCount.value = response.completedCount
        } catch (err) {
            console.error('Fetch failed:', err)
        }
    }
    const markComplete = async (todo) => {
        todo.status = todo.status == 'pending' ? 'completed' : 'pending'
        try {
            await fetch('/todos/'+todo._id, {
                method: 'PATCH',
                body: todo
            })
        } catch (err) {
            console.error('update todo failed:', err)
        }
        notification('positive', 'Task successfully updated!')
        fetchTodos()
        fetchSidebarData()
    }
    const fetchCategories = async () => {
        try {
            const response = await fetch('/categories/all', { params: { userId: userInfo.value._id } })
            categories.value = response
        } catch (err) {
            console.error('Fetch failed:', err)
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
    const getTabChipColor = (tabName) => {
        switch (tabName) {
            case 'all':
                return '#44423c'
            case 'pending':
                return '#1c2f4c'
            case 'completed':
                return '#1e3833'
            default:
                return 'grey-8'
        }
    }
    const getTabChipTextColor = (tabName) => {
        switch (tabName) {
            case 'all':
                return 'amber-6'
            case 'pending':
                return 'light-blue'
            case 'completed':
                return 'green'
            default:
                return 'grey-8'
        }
    }
    const getTodoCount = (tabName) => {
        switch (tabName) {
            case 'all':
                return totalTodos.value
            case 'pending':
                return pendingCount.value
            case 'completed':
                return completedCount.value
            default:
                return 0
        }
    }
    const formatDate = (date) => {
        return moment(date).format('MMMM DD, YYYY')
    }
    const formatTime = (time) => {
        return moment(time, 'HH:mm').format('h:mm A'); 
    }
    
    // ===== COMPUTED PROPERTIES =====
    const maxPages = computed(() => {
        return Math.ceil(totalTodos.value / limit.value)
    })
    const skip = computed(() => {
        return (currentPage.value - 1) * limit.value
    })

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
        fetchTodos()
        fetchCategories()
    })

    // watch
    watch(currentPage, () => {
        fetchTodos()
    })
    watch(searchQuery, () => {
        fetchTodos()
    })
    watch(activeTab, () => {
        currentPage.value = 1  // Reset to page 1 when changing tabs
        fetchTodos()
    })

</script>

<style scoped>
.todo-item {
    background-color: #152031;
    color: white;
}
.todo-rounded {
    border-radius: 10px;
}
.no-data p {
    color: white;
    text-align: center;
    padding: 10px;
    font-style: italic;
    font-size: 12px;
}
.chip-due, .chip-icon {
    border-radius: 10px !important;
}
.chip-due {
    font-size: 12px;
    padding: 14px 10px !important;
}
.overlapping {
    box-shadow: 0 0 0 1px #0e1827;
    display: inline-block;
}
.overlapping:not(:first-child) {
    margin-left: -5px;
}
.tab-item {
    text-transform: none;
    font-weight: 500;
}
/* .tab-item .q-chip .q-chip__content {
    font-size: 12px !important;
} */
.custom-chip-size {
    font-size: 12px !important;
}
/* .custom-chip-size .q-chip__content {
    font-size: 12px !important;
} */
.search-input {
    border-radius: 8px;
}
.action-dropdown-wrapper {
    border-radius: 10px;
}
</style>