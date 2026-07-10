<template>
    <div>
        <q-card>
            <q-card-section class="row items-center">
            <q-avatar icon="fa-regular fa-trash-can" color="amber-6" text-color="red" />
            <!-- <i class=""></i> -->
            <span class="q-ml-sm">Delete this {{ getTableName }}?</span>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-lg">
                <q-btn flat label="Cancel" text-color="black" @click="cancelDeleteDialog"/>
                <q-btn label="Delete" color="amber-6" text-color="black" @click="deleteItem"/>
            </q-card-actions>
      </q-card>
    </div>
</template>
<script setup>
    const { fetch, apiBase } = useApi()
    const props = defineProps(['item', 'table'])
    const emit = defineEmits(['cancelDeleteDialog', 'deleteItem'])

    // ===== REACTIVE VARIABLES =====
    
    // ===== METHODS =====
    const cancelDeleteDialog = () => {
        emit('cancelDeleteDialog', false) 
    }
    
    // API calls
    const deleteItem = async () => {
        const url = '/' + props.table + '/'
        console.log('deleteItem', `${url}${props.item._id}`, props.item)
        try {
            await fetch(`${url}${props.item._id}`, {
                method: 'DELETE'
            })
            emit('deleteItem')
        } catch (err) {
            console.error('Item deletion failed:', err)
        }
    }

    // ===== COMPUTED PROPERTIES =====
    const getTableName = computed(() => {
        if(props.table === 'todos') {
            return 'task'
        }
        if(props.table === 'categories') {
            return 'category'
        }

        // let str = props.table.slice(0, -1); // removes 's' from the string (todos -> todo)
        return props.table
    })
</script>