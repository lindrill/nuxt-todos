<template>
    <div class="row">
        <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
            <SharedMenu />
        </div>
        <div class="page col-6">
            <div class="page-header row justify-between q-mt-md q-px-md">
                <h6 class="page-title">Todos</h6>
                <div class="q-mt-lg">
                    <q-btn color="amber-7" text-color="grey-10" rounded class="q-mt-md" @click="openNewTaskDialog = true">
                        <q-icon left size="1em" name="fa-solid fa-plus" />
                        <div>New Task</div>
                    </q-btn>
                </div>
            </div>
            <!-- Tasks -->
            <div class="q-px-sm" v-if="todos.length > 0">
                <q-card class="my-card bg-layer card-rounded" flat>
                    <q-card-section>
                        <div class="">
                            <q-list class="rounded-borders">
                                <q-item class="todo-item q-my-sm todo-rounded" v-for="todo in todos" :key="todo._id">
                                    <q-item-section avatar top>
                                        <q-checkbox 
                                            :model-value="todo.status == 'completed'" 
                                            @update:model-value="markComplete(todo)"
                                        />
                                    </q-item-section>

                                    <q-item-section class="col-4">
                                        <q-item-label lines="1">
                                            <span class="q-mr-xs">{{ todo.title }}</span>
                                            <q-chip v-if="todo.category" color="grey-2" text-color="amber-7" class="chip-icon q-px-sm q-ml-sm">
                                                <q-icon :name="`fa-solid fa-${todo.category?.icon}`" text-color="grey-8" size="14px">
                                                    <q-tooltip class="bg-amber-7 text-black" :offset="[10, 10]">{{ todo.category?.title }}</q-tooltip>
                                                </q-icon>
                                            </q-chip>
                                            <q-chip :color="getStatusColor(todo.status)" :text-color="'black'" size="sm" class="q-px-sm q-ml-xs">
                                                {{ todo.status }}
                                            </q-chip>
                                        </q-item-label>
                                    </q-item-section>

                                    <q-item-section></q-item-section>

                                    <q-item-section side>
                                        <div class="text-grey-8 q-gutter-xs">
                                            <q-avatar color="purple" text-color="white" size="28px" class="overlapping q-mt-none">
                                                {{ getNameInitials(todo.createdBy) }}
                                            </q-avatar>
                                            <q-chip  color="grey-2" text-color="grey-8" class="chip-due q-mt-sm q-ml-sm">
                                                <q-icon name="fa-regular fa-calendar" text-color="grey-8" size="14px" class="q-mr-xs" />
                                                {{ formatDate(todo.dueDate) }}
                                            </q-chip>
                                            <q-chip  color="grey-2" text-color="grey-8" class="chip-due q-mt-sm">
                                                <q-icon name="fa-regular fa-clock" text-color="grey-8" size="14px" class="q-mr-xs" />
                                                {{ formatTime(todo.time) }}
                                            </q-chip>
                                            <q-btn-dropdown size="12px" dense unelevated color="grey-2" text-color="grey-8" dropdown-icon="more_vert" class="btn-action q-ml-xs">
                                                <q-list>
                                                    <q-item clickable v-close-popup @click="todoActions('view', todo)">
                                                        <q-item-section avatar>
                                                            <q-avatar icon="fa-solid fa-eye" size="2em" color="green" text-color="white" />
                                                        </q-item-section>
                                                        <q-item-section>
                                                            <q-item-label>View</q-item-label>
                                                        </q-item-section>
                                                    </q-item>

                                                    <q-item clickable v-close-popup @click="todoActions('edit', todo)">
                                                        <q-item-section avatar>
                                                            <q-avatar icon="edit" size="2em" color="primary" text-color="white" />
                                                        </q-item-section>
                                                        <q-item-section>
                                                            <q-item-label>Edit</q-item-label>
                                                        </q-item-section>
                                                    </q-item>

                                                    <q-item clickable v-close-popup @click="todoActions('delete', todo)">
                                                        <q-item-section avatar>
                                                            <q-avatar icon="delete" size="2em" color="red" text-color="white" />
                                                        </q-item-section>
                                                        <q-item-section>
                                                            <q-item-label>Delete</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-btn-dropdown>
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                            <div class="q-pa-lg flex flex-center">
                                <q-pagination
                                    v-model="currentPage"
                                    color="amber-7"
                                    :max="maxPages"
                                    boundary-links
                                    flat
                                    size="12px"
                                />
                            </div>
                        </div>
                    </q-card-section>

                </q-card>
            </div>
            <div class="q-px-sm" v-else>
                <q-card class="my-card bg-layer card-rounded no-data" flat>
                    <p>No data available.</p>
                </q-card>
            </div>
        </div>
        <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
            <SharedSidebar />
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
    </div>
</template>
<script setup>
    import { useQuasar } from 'quasar'
    import moment from 'moment'
    
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
    }
    const todoActions = (action, selectedTodo) => {
        todo.value = selectedTodo
        console.log('selected todo', todo.value)
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
    }
    const updateTodo = () => {
        openEditTaskDialog.value = false
        notification('positive', 'Task successfully updated!')
        fetchTodos()
    }
    
    // API calls
    const fetchTodos = async () => {
        try {
            const response = await fetch('/todos/all', { params: { userId: userInfo.value._id, skip: skip.value, limit: limit.value } })
            console.log('fetch todos', response)
            todos.value = response.todos
            totalTodos.value = response.total
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
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'blue-3'
            case 'completed':
                return 'green-3'
            default:
                return 'grey-2'
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
        console.log('currentPage', currentPage.value)
        fetchTodos()
    })

</script>

<style scoped>
.todo-item {
    background-color: white;
}
.todo-rounded {
    border-radius: 15px;
}
.no-data p {
    color: white;
    text-align: center;
    padding: 10px;
    font-style: italic;
    font-size: 12px;
}
.btn-action, .chip-due, .chip-icon {
    border-radius: 10px !important;
}
.chip-due {
    font-size: 12px;
    padding: 14px 10px !important;
}
.overlapping {
    box-shadow: 0 0 0 2px #f5f5f5;
    display: inline-block;
}
.overlapping:not(:first-child) {
    margin-left: -5px;
}
  
</style>