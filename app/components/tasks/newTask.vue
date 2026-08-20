<template>
    <q-card style="width: 500px; padding: 10px 20px 20px 20px;" class="task-form">
        <q-form @submit="saveNewTodo">
            <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
                <div class="text-h6">New Task</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="cancelNewTaskDialog" />
            </q-card-section>
            <q-card-section class="q-mx-md">
                <div class="q-my-sm">
                    <label for="title">Task Name</label>
                    <q-input outlined v-model="newTodo.title" placeholder="e.g. Buy groceries" color="amber-6" lazy-rules :rules="[rules.required]" class="q-mt-sm"/>
                </div>
                <div class="q-mb-lg">
                    <label for="title">Category</label>
                    <q-select 
                        outlined 
                        v-model="newTodo.category" 
                        color="amber-6" 
                        :options="catOptions" 
                        option-value="_id" 
                        option-label="title" 
                        use-input
                        use-chips
                        stack-label
                        @filter="filterCategory"
                        clearable
                        class="q-mt-sm"
                        >
                        <template v-slot:selected>
                            <q-icon :name="'fa-solid fa-'+newTodo.category.icon" color="amber-6" size="24px" class="q-mr-md q-ml-sm" />
                            {{ newTodo.category.title }}
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section avatar>
                                    <q-icon :name="'fa-solid fa-'+scope.opt.icon" size="24px" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ scope.opt.title }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </div>
                <div class="q-my-sm">
                    <label for="description">Description</label>
                    <q-input outlined autogrow v-model="newTodo.description" color="amber-6" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm q-mt-lg">
                    <label for="date">Date</label>
                    <q-input outlined v-model="newTodo.dueDate" color="amber-6" mask="date" lazy-rules :rules="['date', rules.required]" class="q-mt-sm">
                        <template v-slot:append>
                            <q-icon name="event" color="white" class="cursor-pointer">
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
                    <q-input outlined v-model="newTodo.time" color="amber-6" mask="time" lazy-rules :rules="['time', rules.required]" class="q-mt-sm">
                        <template v-slot:append>
                        <q-icon name="access_time" color="white" class="cursor-pointer">
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
            <q-card-actions align="right" class="q-pb-lg q-mr-lg">
                <q-btn flat label="Cancel" color="amber-6" text-color="white" @click="cancelNewTaskDialog"/>
                <q-btn type="submit" unelevated icon="save" label="Save Task" color="purple" text-color="white"/>
            </q-card-actions>
        </q-form>
    </q-card>
</template>

<script setup>
    import moment from 'moment'

    const { fetch } = useApi()
    const { userInfo } = useAuth()

    // ===== REACTIVE VARIABLES =====
    const emit = defineEmits(['cancelNewTaskDialog', 'saveNewTodo'])
    const props = defineProps(['categories'])
    const newTodo = ref({
        title: "",
        description: "",
        category: "",
        dueDate: "",
        time: "",
        completed: false,
        createdBy: userInfo.value._id
    })
    const time = ref('10:56')
    const timeWithSeconds = ref('10:56:00')
    const rules = ref({
        required: val => !!val || 'Field is required'
    })
    const catOptions = ref(props.categories)
    
    // ===== METHODS =====
    const cancelNewTaskDialog = () => {
        emit('cancelNewTaskDialog', false) 
    }
    const filterCategory = (val, update, abort) => {
        update(() => {
            if (val === '') {
                catOptions.value = props.categories
            } else {
                const search = val.toLowerCase()
                catOptions.value = props.categories.filter(v => v.title.toLowerCase().includes(search))
            }
        })
    }
    
    // API calls
    const saveNewTodo = async () => {
        newTodo.value.category = newTodo.value.category._id
        newTodo.value.dueDate = moment(newTodo.value.dueDate, 'YYYY/MM/DD').format('YYYY-MM-DD')
        console.log('saveNewTodo', newTodo.value)
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