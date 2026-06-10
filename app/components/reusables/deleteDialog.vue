<template>
    <div>
        <q-card>
            <q-card-section class="row items-center">
            <q-avatar icon="fa-regular fa-trash-can" color="amber-7" text-color="red" />
            <!-- <i class=""></i> -->
            <span class="q-ml-sm">Delete this task?</span>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-lg">
                <q-btn flat label="Cancel" text-color="black" @click="cancelDeleteDialog"/>
                <q-btn label="Delete" color="amber-7" text-color="black" @click="deleteTodo"/>
            </q-card-actions>
      </q-card>
    </div>
</template>
<script setup>
    const { fetch, apiBase } = useApi()
    const props = defineProps(['todo'])
    const emit = defineEmits(['cancelDeleteDialog', 'deleteTodo'])

    // ===== REACTIVE VARIABLES =====
    const newTodo = ref({
        title: "",
        description: "",
        // dateCreated: "",
        // dueDate: "",
        status: "pending", // pending, in-progress, completed
    })
    
    // ===== METHODS =====
    const cancelDeleteDialog = () => {
        emit('cancelDeleteDialog', false) 
    }
    
    // API calls
    const deleteTodo = async () => {
        try {
            await fetch('/todos/'+props.todo._id, {
                method: 'DELETE'
            })
            emit('deleteTodo')
        } catch (err) {
            console.error('Add todo failed:', err)
        }
    }
</script>