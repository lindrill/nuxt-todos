<template>
    <q-card style="width: 450px; padding: 20px;" class="delete-form">
        <q-card-section class="column items-center q-pt-lg q-pb-md">
            <div class="delete-icon-wrapper q-mb-md">
                <q-icon color="red" size="80px" name="mdi-delete-alert" />
            </div>
            <div class="text-h6 text-weight-medium q-mb-sm text-center">
                Delete this {{ getTableName }}?
            </div>
            <div class="text-caption text-center q-px-md" style="max-width: 350px;">
                This action cannot be undone. This {{ getTableName }} will be permanently removed.
            </div>
        </q-card-section>

        <q-card-section v-if="item" class="q-px-lg q-py-md">
            <!-- Task Details -->
            <div class="task-preview-card q-pa-md" v-if="props.table == 'todos'">
                <div class="row items-center">
                    <div class="task-icon-small q-mr-md" v-if="item.category?.icon">
                        <q-icon :name="`fa-solid fa-${item.category.icon}`" size="24px" color="amber-6"/>
                    </div>
                    
                    
                    <div class="col">
                        <div class="text-body1 text-weight-medium q-mb-xs">
                            {{ item.title }}
                        </div>
                        <div class="row items-center text-caption">
                            <q-badge 
                                v-if="item.status"
                                :label="item.status" 
                                class="q-mr-sm text-capitalize"
                            />
                            <span v-if="item.dueDate" class="q-mr-sm">
                                <q-icon name="event" size="14px" class="q-mr-xs" />
                                {{ formatDate(item.dueDate) }}
                            </span>
                            <span v-if="item.time">
                                <q-icon name="schedule" size="14px" class="q-mr-xs" />
                                {{ item.time }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Category Details -->
            <div class="task-preview-card q-pa-md" v-else-if="props.table == 'categories'">
                <div class="row items-center">
                    <div class="task-icon-small q-mr-md" v-if="item.icon">
                        <q-icon :name="`fa-solid fa-${item.icon}`" size="24px" color="amber-6"/>
                    </div>
                    
                    
                    <div class="col">
                        <div class="text-body1 text-weight-medium q-mb-xs">
                            {{ item.title }}
                        </div>
                        <div class="row items-center text-caption">
                            <span class="q-mr-sm">
                                <q-icon name="event" size="14px" class="q-mr-xs" />
                                {{ formatDate(item.createdAt) }}
                            </span>
                            <span v-if="item.createdBy">
                                <q-avatar size="14px" color="purple-5" text-color="white" class="q-mr-xs q-ml-sm">
                                    {{ getNameInitials(item.createdBy) }}
                                </q-avatar>
                                {{ getFullName(item.createdBy) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- User Details -->
            <div class="task-preview-card q-pa-md" v-else-if="props.table == 'users'">
                <div class="row items-center">
                    <div class="task-icon-small q-mr-md">
                        <q-avatar size="24px" color="purple-5" text-color="white" class="q-mr-xs q-ml-sm">
                            {{ getNameInitials(item) }}
                        </q-avatar>
                    </div>
                    <div class="col">
                        <div class="text-body1 text-weight-medium q-mb-xs">
                            {{ getFullName(item) }}
                        </div>
                        <div class="row items-center text-caption">
                            <span class="q-mr-sm">
                                {{ item.role }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
            <q-btn flat label="Cancel" icon="close" color="amber-6" text-color="white" @click="cancelDeleteDialog"/>
            <q-btn 
                unelevated
                label="Delete Task" 
                icon="delete"
                color="red"
                @click="deleteItem"
            />
        </q-card-actions>
    </q-card>
</template>
<script setup>
    import moment from 'moment'
    
    const { fetch, apiBase } = useApi()
    const props = defineProps(['item', 'table'])
    const emit = defineEmits(['cancelDeleteDialog', 'deleteItem'])

    // ===== REACTIVE VARIABLES =====
    
    // ===== METHODS =====
    const cancelDeleteDialog = () => {
        emit('cancelDeleteDialog', false) 
    }
    const formatDate = (date) => {
        return moment(date).format('MMMM DD, YYYY')
    }
    const getNameInitials = (user) => {
        const name = user.first_name + ' ' + user.last_name
        return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
    }
    const getFullName = (user) => {
        if (!user) return 'Unknown'
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown'
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

        let str = props.table.slice(0, -1); // removes 's' from the string (todos -> todo)
        return str
    })
</script>
<style scoped>
.task-preview-card {
    border-radius: 8px;
    border: 1px solid #273238;
}
</style>