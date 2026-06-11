<template>
    <div>
        <q-card style="width: 500px">
            <q-form @submit="saveNewTodo">
                <q-card-section class="q-mx-md">
                    <div class="text-h6 q-my-lg q-pb-sm">New Task</div>
                    <div class="q-my-sm">
                        <label for="title" >Task Name</label>
                        <q-input filled v-model="newTodo.title" color="amber-7" lazy-rules :rules="[rules.required]"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="description">Description</label>
                        <q-input filled autogrow v-model="newTodo.description" color="amber-7"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="date">Date</label>
                        <q-input filled v-model="newTodo.dueDate" mask="date" lazy-rules :rules="['date', rules.required]">
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="newTodo.dueDate">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                        
                    </div>
                    <div class="q-my-sm">
                        <label for="time">Time</label>
                        <q-input filled v-model="newTodo.time" mask="time" lazy-rules :rules="['time', rules.required]">
                            <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy
                                cover
                                transition-show="scale"
                                transition-hide="scale"
                                >
                                <q-time v-model="newTodo.time">
                                    <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                                </q-popup-proxy>
                            </q-icon>
                            </template>
                        </q-input>
                    </div>
                </q-card-section>
                <q-card-actions align="right" class="q-pa-lg">
                    <q-btn flat label="Cancel" color="amber-7" text-color="black" @click="cancelNewTaskDialog"/>
                    <q-btn type="submit" label="Save" color="amber-7" text-color="black"/>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
</template>

<script setup>
    const { fetch, apiBase } = useApi()

    // ===== REACTIVE VARIABLES =====
    const emit = defineEmits(['cancelNewTaskDialog', 'saveNewTodo'])
    const newTodo = ref({
        title: "",
        description: "",
        dueDate: "",
        time: "",
        completed: false
    })
    const time = ref('10:56')
    const timeWithSeconds = ref('10:56:00')
    const rules = ref({
        required: val => !!val || 'Field is required'
    })
    
    // ===== METHODS =====
    const cancelNewTaskDialog = () => {
        emit('cancelNewTaskDialog', false) 
    }
    
    // API calls
    const saveNewTodo = async () => {
        try {
            await fetch('/todos/new', {
                method: 'POST',
                body: newTodo.value
            })
            emit('saveNewTodo')
        } catch (err) {
            console.error('Add todo failed:', err)
        }
    }
</script>