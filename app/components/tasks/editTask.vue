<template>
    <div>
        <q-card style="width: 500px">
            <q-form @submit="updateTodo">
                <q-card-section class="q-mx-md">
                    <div class="text-h6 q-my-lg q-pb-sm">Edit Task</div>
                    <div>
                        <div class="q-my-sm">
                            <label for="title" >Task Name</label>
                            <q-input filled v-model="clonedTodo.title" color="amber-7" lazy-rules :rules="[rules.required]"/>
                        </div>
                        <div class="q-my-sm">
                            <label for="description">Description</label>
                            <q-input filled autogrow v-model="clonedTodo.description" color="amber-7" lazy-rules :rules="[rules.required]"/>
                        </div>
                        <div class="q-my-sm">
                            <label for="description">Date</label>
                            <q-input filled v-model="clonedTodo.dueDate" mask="date" lazy-rules :rules="[rules.required]">
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="clonedTodo.dueDate">
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
                            <label for="description">Time</label>
                            <q-input filled v-model="clonedTodo.time" mask="time" lazy-rules :rules="[rules.required]">
                                <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy
                                    cover
                                    transition-show="scale"
                                    transition-hide="scale"
                                    >
                                    <q-time v-model="clonedTodo.time">
                                        <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                    </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                                </template>
                            </q-input>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-lg">
                    <q-btn flat label="Cancel" color="amber-7" text-color="black" @click="cancelEditTaskDialog"/>
                    <q-btn type="submit" label="Save" color="amber-7" text-color="black"/>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
</template>

<script setup>
    const { fetch, apiBase } = useApi()
    const props = defineProps(['todo'])
    const emit = defineEmits(['cancelEditTaskDialog', 'updateTodo'])

    // ===== REACTIVE VARIABLES =====
    const clonedTodo = ref({ ...props.todo })
    const rules = ref({
        required: val => !!val || 'Field is required'
    })
    
    // ===== METHODS =====
    const cancelEditTaskDialog = () => {
        emit('cancelEditTaskDialog', false) 
    }
    
    // API calls
    const updateTodo = async () => {
        try {
            await fetch('/todos/'+props.todo._id, {
                method: 'PATCH',
                body: clonedTodo.value
            })
            emit('updateTodo')
        } catch (err) {
            console.error('update todo failed:', err)
        }
    }
</script>