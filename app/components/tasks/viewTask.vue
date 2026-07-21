<template>
    <q-card style="width: 500px; padding: 10px 20px 20px 20px;" class="task-details">
        <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
            <div class="text-h6">Task Details</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="cancelViewTaskDialog" />
        </q-card-section>
        <q-card-section class="q-mx-md">
            <div class="row items-center q-mb-lg task-header-section">
                <div class="form-icon-wrapper q-mr-md">
                    <q-icon :name="`fa-solid fa-${todo.category?.icon}`" size="32px" color="amber-6" />
                </div>
                <div class="col">
                    <div class="text-body1">{{ todo.title }}</div>
                    <q-chip :text-color="getStatusTextColor(todo.status)" size="sm" class="q-px-sm q-py-xs q-ml-none" :style="{ backgroundColor: getStatusBgColor(todo.status), borderColor: getStatusTextColor(todo.status) + ' !important' }">
                        <span class="text-weight-medium text-capitalize">{{ todo.status }}</span>
                    </q-chip>
                </div>
            </div>

            <q-separator class="q-mb-lg" color="blue-grey-10" />

             <!-- Due Date and Time -->
            <div class="row">
                <div class="col-6">
                    <div class="info-section">
                        <div class="info-icon-wrapper q-mr-md">
                            <q-icon name="event" size="24px" color="blue-5" />
                        </div>
                        <div>
                            <div class="text-caption text-grey-5 q-mb-xs">Due Date</div>
                            <div class="text-body2 text-white text-weight-medium">{{ formatDate(todo.dueDate) }}</div>
                            <div class="text-caption text-grey-6">{{ formatDay(todo.dueDate) }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="info-section">
                        <div class="info-icon-wrapper q-mr-md">
                            <q-icon name="schedule" size="24px" color="blue-5" />
                        </div>
                        <div>
                            <div class="text-caption text-grey-5 q-mb-xs">Time</div>
                            <div class="text-body2 text-white text-weight-medium">{{ formatTime(todo.time) || 'Not set' }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="q-my-lg">
                <div class="text-caption text-grey-5 q-mb-xs">Description</div>
                <div class="q-mt-xs text-body2">{{ todo.description || 'No description provided' }}</div>
            </div>

            <q-separator class="q-mb-lg" color="blue-grey-10" />

            <!-- Created By and Created On -->
            <div class="row q-col-gutter-md q-mb-md">
                <div class="col-6">
                    <div class="text-caption text-grey-5 q-mb-sm">Created By</div>
                    <div class="row items-center" v-if="todo.createdBy">
                        <q-avatar size="40px" color="purple-5" text-color="white" class="q-mr-sm">
                            {{ getNameInitials(todo.createdBy) }}
                        </q-avatar>
                        <div>
                            <div class="text-body2 text-white">{{ getFullName(todo.createdBy) }}</div>
                            <div class="text-caption text-grey-6">{{ todo.createdBy.role || 'Admin' }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="text-caption text-grey-5 q-mb-sm">Created On</div>
                    <div class="info-section">
                        <div class="info-icon-wrapper-small q-mr-sm">
                            <q-icon name="event" size="20px" color="purple-5" />
                        </div>
                        <div>
                            <div class="text-body2 text-white">{{ formatDate(todo.createdAt) }}</div>
                            <div class="text-caption text-grey-6">{{ formatTime(todo.createdAt) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
            <q-btn flat label="Close" color="amber-6" text-color="white" @click="cancelViewTaskDialog"/>
        </q-card-actions>
    </q-card>
</template>

<script setup>
    import moment from 'moment'
    
    const props = defineProps(['todo'])
    const emit = defineEmits(['cancelViewTaskDialog'])

    const cancelViewTaskDialog = () => {
        emit('cancelViewTaskDialog', false) 
    }

    const formatDate = (date) => {
        return moment(date).format('MMMM DD, YYYY')
    }
    const formatDay = (date) => {
        return moment(date).format('dddd')
    }
    const formatTime = (time) => {
        return moment(time, 'HH:mm').format('h:mm A'); 
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
    const getNameInitials = (user) => {
        const name = user.first_name + ' ' + user.last_name
        return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
    }
    const getFullName = (user) => {
        if (!user) return 'Unknown'
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown'
    }
</script>

<style scoped>
label {
    font-size: 0.875rem;
}
/* .task-icon-wrapper {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 193, 7, 0.1);
} */
.task-details-separator {
    color: #29303f !important;
}
.info-section {
    display: flex;
    align-items: flex-start;
}
.info-icon-wrapper {
    width: 48px;
    height: 48px;
    background: rgba(33, 150, 243, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
</style>