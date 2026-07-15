<template>
    <q-card style="width: 500px" class="task-form">
        <q-form @submit="updateTodo">
            <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
                <div class="text-h6">Edit Task</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="cancelEditTaskDialog" />
            </q-card-section>
            <q-card-section class="q-mx-md">
                <div class="q-my-sm">
                    <label for="title">Task Name</label>
                    <q-input outlined v-model="clonedTodo.title" color="amber-6"  lazy-rules :rules="[rules.required]" class="q-mt-sm"/>
                </div>
                <div class="q-mb-lg">
                    <label for="title">Category</label>
                    <q-select 
                        outlined 
                        v-model="clonedTodo.category" 
                        color="amber-6" 
                        :options="catOptions" 
                        option-value="_id" 
                        option-label="title" 
                        emit-value
                        map-options
                        use-input
                        use-chips
                        stack-label
                        @filter="filterCategory"
                        clearable
                        class="q-mt-sm"
                        >
                        <template v-slot:selected>
                            <q-icon color="amber-6" :name="'fa-solid fa-'+selectedCategory?.icon" size="24px" class="q-ml-sm"/>
                            {{ selectedCategory?.title }}
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
                    <q-input outlined autogrow v-model="clonedTodo.description" color="amber-6" class="q-mt-sm" lazy-rules/>
                </div>
                <div class="q-my-sm q-mt-lg">
                    <label for="description">Date</label>
                    <q-input outlined v-model="clonedTodo.dueDate" mask="date" lazy-rules :rules="[rules.required]">
                        <template v-slot:append>
                            <q-icon name="event" color="white" class="cursor-pointer">
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
                    <q-input outlined v-model="clonedTodo.time" mask="time" lazy-rules :rules="[rules.required]">
                        <template v-slot:append>
                        <q-icon name="access_time" color="white" class="cursor-pointer">
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
            </q-card-section>

            <q-card-actions align="right" class="q-pa-lg">
                <q-btn flat label="Cancel" color="amber-6" text-color="black" @click="cancelEditTaskDialog"/>
                <q-btn type="submit" label="Save Task" color="amber-6" text-color="black"/>
            </q-card-actions>
        </q-form>
    </q-card>
</template>

<script setup>
    const { fetch, apiBase } = useApi()
    const props = defineProps(['todo', 'categories'])
    const emit = defineEmits(['cancelEditTaskDialog', 'updateTodo'])
    const catOptions = ref(props.categories)

    // ===== REACTIVE VARIABLES =====
    const clonedTodo = ref({ ...props.todo })
    const rules = ref({
        required: val => !!val || 'Field is required'
    })
    
    // ===== METHODS =====
    const cancelEditTaskDialog = () => {
        emit('cancelEditTaskDialog', false) 
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

    // ===== COMPUTED PROPERTIES =====
    const selectedCategory = computed(() => {
        return props.categories.find(cat => cat._id === clonedTodo.value.category)
    })
    
    // API calls
    const updateTodo = async () => {
        console.log('update todo', clonedTodo.value)
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

    onMounted(() => {
        // console.log('edit task mounted', props.categories)
    })
</script>