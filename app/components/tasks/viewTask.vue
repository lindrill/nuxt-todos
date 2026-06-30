<template>
    <div>
        <q-card style="width: 500px">
            <q-card-section class="q-mx-md">
                <div class="text-h6 q-my-lg q-pb-sm">Task Details</div>
                
                <div class="q-my-md">
                    <label class="text-weight-medium text-grey-8">Task Name</label>
                    <div class="q-mt-xs text-body1">{{ todo.title }}</div>
                </div>

                <div class="q-my-md">
                    <label class="text-weight-medium text-grey-8">Description</label>
                    <div class="q-mt-xs text-body1">{{ todo.description || 'No description provided' }}</div>
                </div>

                <div class="row q-col-gutter-md q-my-md">
                    <div class="col-6">
                        <label class="text-weight-medium text-grey-8">Due Date</label>
                        <div class="q-mt-xs text-body1">
                            <q-icon name="event" class="q-mr-xs" />
                            {{ formatDate(todo.dueDate) }}
                        </div>
                    </div>
                    <div class="col-6">
                        <label class="text-weight-medium text-grey-8">Time</label>
                        <div class="q-mt-xs text-body1">
                            <q-icon name="access_time" class="q-mr-xs" />
                            {{ todo.time || 'Not set' }}
                        </div>
                    </div>
                </div>

                <div class="q-my-md">
                    <label class="text-weight-medium text-grey-8">Status</label>
                    <div class="q-mt-xs">
                        <q-badge 
                            :color="todo.status === 'completed' ? 'green' : 'orange'" 
                            :label="todo.status === 'completed' ? 'Completed' : 'Pending'"
                        />
                    </div>
                </div>

                <div class="q-my-md" v-if="todo.createdBy">
                    <label class="text-weight-medium text-grey-8">Created By</label>
                    <div class="q-mt-xs text-body1">
                        <q-icon name="person" class="q-mr-xs" />
                        {{ todo.createdBy.first_name + ' ' + todo.createdBy.last_name || 'Unknown' }}
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-lg">
                <q-btn flat label="Close" color="amber-7" text-color="black" @click="cancelViewTaskDialog"/>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script setup>
    const props = defineProps(['todo'])
    const emit = defineEmits(['cancelViewTaskDialog'])

    const cancelViewTaskDialog = () => {
        emit('cancelViewTaskDialog', false) 
    }

    const formatDate = (date) => {
        if (!date) return 'Not set'
        const d = new Date(date)
        return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }
</script>

<style scoped>
label {
    font-size: 0.875rem;
}
</style>