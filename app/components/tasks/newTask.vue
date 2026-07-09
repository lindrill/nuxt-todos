<template>
    <div>
        <q-card style="width: 500px">
            <q-form @submit="saveNewTodo">
                <q-card-section class="q-mx-md">
                    <div class="text-h6 q-my-lg q-pb-sm">New Task</div>
                    <div class="q-my-sm">
                        <label for="title">Task Name</label>
                        <q-input filled v-model="newTodo.title" color="amber-7" lazy-rules :rules="[rules.required]"/>
                    </div>
                    <div class="q-mb-lg">
                        <label for="title">Category</label>
                        <q-select 
                            filled 
                            v-model="newTodo.category" 
                            color="amber-7" 
                            :options="catOptions" 
                            option-value="_id" 
                            option-label="title" 
                            use-input
                            use-chips
                            stack-label
                            @filter="filterCategory"
                            clearable
                            >
                            <template v-slot:selected>
                                <q-chip
                                v-if="newTodo.category"
                                dense
                                square
                                color="white"
                                text-color="amber-7"
                                class="q-my-none q-ml-xs q-mr-none"
                                >
                                <q-avatar color="amber-7" text-color="white" :icon="'fa-solid fa-'+newTodo.category.icon" />
                                {{ newTodo.category.title }}
                                </q-chip>
                                <!-- <q-badge v-else>*none*</q-badge> -->
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