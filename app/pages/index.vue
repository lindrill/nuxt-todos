<template>
    <div>
        <div class="row">
            <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
                <SharedMenu />
            </div>
            <div class="page col-6">
                <div class="page-header row justify-between q-mt-md q-px-md">
                    <h5 class="page-title">Dashboard</h5>
                    <div class="q-mt-lg">
                        <q-btn color="amber-7" text-color="grey-10" rounded class="q-mt-md" @click="openNewTaskDialog = true">
                            <q-icon left size="1em" name="fa-solid fa-plus" />
                            <div>New Task</div>
                        </q-btn>
                    </div>
                </div>
                <div class="row justify-between q-px-md">
                    <q-card class="my-card col-6 bg-layer text-white card-rounded q-col-gutter-sm" flat>
                        <q-card-section class="q-pb-none">
                            <div class="row flex-center">
                                <div class="col-9">
                                    <q-list>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-icon left color="amber-7" name="fa-regular fa-calendar-check" />
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold text-subtitle1">12 Tasks</q-item-label>
                                                <q-item-label class="text-caption" lines="2">Completed</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                                <div class="col-3">
                                    <q-circular-progress
                                        show-value
                                        class="text-green q-ma-md"
                                        :value="50"
                                        size="60px"
                                        color="green"
                                        track-color="grey"
                                        :thickness="0.15"
                                    >50%</q-circular-progress>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                    <q-card class="my-card col-6 bg-layer text-white card-rounded q-col-gutter-sm" flat>
                        <q-card-section class="q-pb-none">
                            <div class="row flex-center">
                                <div class="col-9">
                                    <q-list>
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-icon left color="amber-7" name="fa-solid fa-hourglass-half" />
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold text-subtitle1">5 Tasks</q-item-label>
                                                <q-item-label class="text-caption" lines="2">Pending</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                                <div class="col-3">
                                    <q-circular-progress
                                        show-value
                                        class="text-purple q-ma-md"
                                        :value="60"
                                        size="60px"
                                        color="purple"
                                        track-color="grey"
                                        :thickness="0.15"
                                    >60%</q-circular-progress>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <!-- Chart -->
                <div class="q-px-sm q-my-lg">
                    <q-card class="my-card bg-layer card-rounded" flat>
                        <q-card-section>
                            <div class="">
                                <ChartsLineChart />
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <!-- Categories -->
                <div class="q-px-sm q-my-lg">
                    <q-card class="my-card bg-layer card-rounded" flat>
                        <q-card-section>
                            <div class="categories-container">
                                <div class="categories-header row justify-between items-center q-mb-lg">
                                    <span class="text-subtitle1 text-white">Categories</span>
                                    <q-btn color="amber-7" text-color="grey-10" rounded class="q-mt-md">
                                        <q-icon left size="1em" name="fa-solid fa-plus" />
                                        <div>New Category</div>
                                    </q-btn>
                                </div>
                                <div class="row q-col-gutter-lg">
                                    <div v-for="category in categories" :key="category.id" class="col-3">
                                        <q-card class="category-card card-rounded text-center cursor-pointer" flat>
                                            <q-card-section class="q-py-lg">
                                                <q-icon :name="category.icon" size="1.5rem" color="white" class="q-mb-sm"/>
                                                <div class="text-white text-caption">{{ category.name }}</div>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                
            </div>
            <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
                <SharedSidebar />
            </div>
        </div>
        <div>
            <q-dialog v-model="openNewTaskDialog" backdrop-filter="blur(4px)" persistent>
                <TasksNewTask @cancelNewTaskDialog="cancelNewTaskDialog" @saveNewTodo="saveNewTodo"/>
            </q-dialog>
        </div>
    </div>
</template>

<script setup>
    import { useQuasar } from 'quasar'
    
    // ===== REACTIVE VARIABLES =====
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const { userInfo, isAuthenticated } = useAuth()

    const openNewTaskDialog = ref(false)
    const openNewCategoryDialog = ref(false)
    const categories = ref([
        { id: 1, name: 'Vacation', icon: 'fa-solid fa-umbrella-beach' },
        { id: 2, name: 'Groceries', icon: 'fa-solid fa-cart-shopping' },
        { id: 3, name: 'Chores', icon: 'fa-solid fa-broom' },
        { id: 4, name: 'Payments', icon: 'fa-solid fa-money-bill' }
    ])
    

    // ===== METHODS =====
    const cancelNewTaskDialog = (cancelNewTaskDialog) => {
        openNewTaskDialog.value = cancelNewTaskDialog
    }
    const saveNewTodo = () => {
        openNewTaskDialog.value = false
        notification('positive', 'Task successfully saved!')
    }
    
    // API calls
    
    // ===== COMPUTED PROPERTIES =====
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
    })

</script>

<style scoped>
.category-card {
    background-color: #222c41;
    /* border-radius: 16px; */
    transition: all 0.3s ease;
}
 
/* .category-card:hover {
    background-color: #353847;
    transform: translateY(-4px);
}
 
.bg-card-dark {
    background-color: #2a2d3a;
} */
</style>