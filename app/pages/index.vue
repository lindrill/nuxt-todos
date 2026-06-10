<template>
    <div>
        <!-- <div class="row bg-layer">
            <div class="col">
                <q-item clickable v-ripple>
                    <q-item-section avatar>
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>Jane Doe</q-item-section>
                </q-item>
            </div>
        </div> -->
        <div class="row">
            <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
                <SharedMenu />
            </div>
            <div class="page col-6">
                <div class="page-header row justify-between q-mt-md q-px-md">
                    <h6 class="page-title">Dashboard</h6>
                    <div class="q-mt-lg">
                        <q-btn color="amber-7" text-color="grey-10" rounded class="q-mt-md" @click="openNewTaskDialog = true">
                            <q-icon left size="1em" name="fa-solid fa-plus" />
                            <div>New Task</div>
                        </q-btn>
                    </div>
                </div>
                <div class="row justify-between q-px-md">
                    <q-card class="my-card col-6 bg-layer text-white card-rounded q-col-gutter-sm" flat>
                        <q-card-section class="q-pb-none">
                            <div class="row flex-center">
                                <div class="col-9">
                                    <q-list>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-icon left color="amber-7" name="fa-regular fa-calendar-check" />
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold">12 Tasks</q-item-label>
                                                <q-item-label class="text-caption" lines="2">Completed</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                                <div class="col-3">
                                    <q-circular-progress
                                        show-value
                                        class="text-green q-ma-md"
                                        :value="50"
                                        size="60px"
                                        color="green"
                                        track-color="grey"
                                        :thickness="0.15"
                                    >50%</q-circular-progress>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                    <q-card class="my-card col-6 bg-layer text-white card-rounded q-col-gutter-sm" flat>
                        <q-card-section class="q-pb-none">
                            <div class="row flex-center">
                                <div class="col-9">
                                    <q-list>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-icon left color="amber-7" name="fa-solid fa-hourglass-half" />
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold">5 Tasks</q-item-label>
                                                <q-item-label class="text-caption" lines="2">Pending</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                                <div class="col-3">
                                    <q-circular-progress
                                        show-value
                                        class="text-purple q-ma-md"
                                        :value="60"
                                        size="60px"
                                        color="purple"
                                        track-color="grey"
                                        :thickness="0.15"
                                    >60%</q-circular-progress>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                 <!-- Tasks -->
                <div class="q-px-sm q-my-lg">
                    <q-card class="my-card bg-layer card-rounded" flat>
                        <q-card-section>
                            <div class="">
                                <q-list class="rounded-borders">
                                    <q-item-label header class="text-weight-bold text-white">Todos</q-item-label>
                                    <q-item class="todo-item q-my-sm todo-rounded" v-for="todo in todos" :key="todo._id">
                                        <q-item-section avatar top>
                                            <q-checkbox 
                                                :model-value="todo.status == 'completed'" 
                                                @update:model-value="markComplete(todo)"
                                            />
                                        </q-item-section>

                                        <q-item-section class="col-4">
                                            <q-item-label class="">{{ todo.title }}</q-item-label>
                                        </q-item-section>

                                        <q-item-section>
                                            
                                        </q-item-section>

                                        <q-item-section side>
                                            <div class="text-grey-8 q-gutter-xs">
                                                <q-btn-dropdown size="12px" flat dense round dropdown-icon="more_vert" @click="onMainClick">
                                                    <q-list>
                                                        <q-item clickable v-close-popup @click="onItemClick('edit', todo)">
                                                            <q-item-section avatar>
                                                                <q-avatar icon="edit" size="2em" color="primary" text-color="white" />
                                                            </q-item-section>
                                                            <q-item-section>
                                                                <q-item-label>Edit</q-item-label>
                                                            </q-item-section>
                                                        </q-item>

                                                        <q-item clickable v-close-popup @click="onItemClick('delete', todo)">
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
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div class="col-3 q-pa-md row q-gutter-md">
                <q-card class="my-card">
                    <q-card-section>
                        Calendar
                        <div class="q-pa-md">
                            <q-date v-model="todaysDate2" today-btn />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div>
            <q-dialog v-model="openNewTaskDialog" backdrop-filter="blur(4px)" persistent>
                <TasksNewTask @cancelNewTaskDialog="cancelNewTaskDialog" @saveNewTodo="saveNewTodo"/>
            </q-dialog>
            <q-dialog v-model="openDeleteDialog" backdrop-filter="blur(4px)" persistent>
                <ReusablesDeleteDialog :todo="todo" @cancelDeleteDialog="cancelDeleteDialog" @deleteTodo="deleteTodo"/>
            </q-dialog>
            <q-dialog v-model="openEditTaskDialog" backdrop-filter="blur(4px)" persistent>
                <TasksEditTask :todo="todo" @cancelEditTaskDialog="cancelEditTaskDialog" @updateTodo="updateTodo"/>
            </q-dialog>
        </div>
    </div>
</template>

<script setup>
    import { useQuasar } from 'quasar'
    
    // ===== REACTIVE VARIABLES =====
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const { userInfo, isAuthenticated } = useAuth()

    const openNewTaskDialog = ref(false)
    const openDeleteDialog = ref(false)
    const openEditTaskDialog = ref(false)
    const todaysDate = ref(new Date().toISOString().split('T')[0])
    const todaysDate2 = ref('2026-06-12')
    const todos = ref([])
    const todo = ref([])
    const modelValue = ref(false)
    // const clonedTodo = useCloned(todo)
    

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
    const saveNewTodo = () => {
        openNewTaskDialog.value = false
        fetchTodos()
    }
    const onMainClick = () => {
        
    }
    const onItemClick = (action, selectedTodo) => {
        todo.value = selectedTodo
        if(action == "edit") {
            // clonedTodo.value = selectedTodo
            // console.log('useCloned', clonedTodo.value)
            openEditTaskDialog.value = true
        } else if(action == "delete") {
            // todo.value = selectedTodo
            openDeleteDialog.value = true
        }
    }
    const deleteTodo = () => {
        openDeleteDialog.value = false
        notification('positive', 'Todo successfully deleted!')
        fetchTodos()
    }
    const updateTodo = () => {
        openEditTaskDialog.value = false
        notification('positive', 'Todo successfully updated!')
        fetchTodos()
    }
    
    // API calls
    const fetchTodos = async () => {
        try {
            const response = await fetch('/todos/all')
            console.log('fetch todos', response)
            todos.value = response
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
        notification('positive', 'Todo successfully updated!')
        fetchTodos()
    }
    
    // ===== COMPUTED PROPERTIES =====
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
        console.log('userInfo', userInfo)
        fetchTodos()
    })

</script>

<style scoped>
.todo-item {
    background-color: white;
}
.todo-rounded {
    border-radius: 10px;
}
</style>