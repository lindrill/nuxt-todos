<template>
    <div class="row">
        <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
            <SharedMenu />
        </div>
        <div class="page col-6">
            <div class="page-header row justify-between q-mt-md q-px-md">
                <h5 class="page-title">Todos</h5>
                <div class="q-mt-lg">
                    <q-btn color="amber-7" text-color="grey-10" rounded class="q-mt-md" @click="openNewTaskDialog = true">
                        <q-icon left size="1em" name="fa-solid fa-plus" />
                        <div>New Task</div>
                    </q-btn>
                </div>
            </div>
            <!-- Tasks -->
            <div class="q-px-sm">
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
        <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
            <SharedSidebar />
        </div>
        <div>
            <q-dialog v-model="openNewTaskDialog" backdrop-filter="blur(4px)" persistent>
                <TasksNewTask @cancelNewTaskDialog="cancelNewTaskDialog" @saveNewTodo="saveNewTodo"/>
            </q-dialog>
            <q-dialog v-model="openDeleteDialog" backdrop-filter="blur(4px)" persistent>
                <ReusablesDeleteDialog :item="todo" :table="'todos'" @cancelDeleteDialog="cancelDeleteDialog" @deleteItem="deleteTodo"/>
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

    const openNewTaskDialog = ref(false)
    const openDeleteDialog = ref(false)
    const openEditTaskDialog = ref(false)
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
            openEditTaskDialog.value = true
        } else if(action == "delete") {
            // todo.value = selectedTodo
            openDeleteDialog.value = true
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
        notification('positive', 'Task successfully updated!')
        fetchTodos()
    }
    
    // ===== COMPUTED PROPERTIES =====
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
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