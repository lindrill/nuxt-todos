<template>
    <div class="row">
        <SharedMenu />
        <div class="page col-6">
            <div class="page-header row justify-between q-px-md q-mt-lg q-mb-lg">
                <div class="q-mb-md">
                    <h5 class="page-title q-mt-md q-mb-none">Dashboard</h5>
                    <span class="text-body2 text-white">Welcome back, {{ displayUserName }}! Here's what's happening today.</span>
                </div>
                <div>
                    <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewTaskDialog = true">
                        <q-icon left size="1em" name="fa-solid fa-plus" />
                        <div>New Task</div>
                    </q-btn>
                </div>
            </div>
            <div class="row justify-between q-px-md">
                <q-card class="my-card col-6 dashboard-stat text-white card-rounded q-col-gutter-sm">
                    <q-card-section class="q-pb-none">
                        <div class="row flex-center">
                            <div class="col-9">
                                <q-list>
                                    <q-item>
                                        <q-item-section avatar>
                                            <q-icon left color="amber-6" name="fa-regular fa-calendar-check" />
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
                <q-card class="my-card col-6 dashboard-stat text-white card-rounded q-col-gutter-sm">
                    <q-card-section class="q-pb-none">
                        <div class="row flex-center">
                            <div class="col-9">
                                <q-list>
                                    <q-item>
                                        <q-item-section avatar>
                                            <q-icon left color="amber-6" name="fa-solid fa-hourglass-half" />
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
                <q-card class="my-card card-rounded dashboard-stat">
                    <q-card-section>
                        <div class="">
                            <ChartsLineChart />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
            <!-- Categories -->
            <div class="q-px-sm q-my-lg">
                <q-card class="my-card dashboard-stat card-rounded">
                    <q-card-section>
                        <div class="categories-container">
                            <div class="categories-header row justify-between items-center q-mb-lg">
                                <span class="text-subtitle1 text-white">Categories</span>
                                <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewCategoryDialog = true">
                                    <q-icon left size="1em" name="fa-solid fa-plus" />
                                    <div>New Category</div>
                                </q-btn>
                            </div>
                            <div class="row q-col-gutter-lg">
                                <div v-for="category in categories1" :key="category.id" class="col-3">
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
        <SharedSidebar />
    </div>
    <div>
        <q-dialog v-model="openNewTaskDialog" backdrop-filter="blur(4px)" persistent>
            <TasksNewTask :categories="categories" @cancelNewTaskDialog="cancelNewTaskDialog" @saveNewTodo="saveNewTodo"/>
        </q-dialog>
        <q-dialog v-model="openNewCategoryDialog" backdrop-filter="blur(4px)" persistent>
            <CategoriesNewCategory @cancelNewCategoryDialog="cancelNewCategoryDialog" @saveNewCategory="saveNewCategory"/>
        </q-dialog>
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
    const categories1 = ref([
        { id: 1, name: 'Vacation', icon: 'fa-solid fa-umbrella-beach' },
        { id: 2, name: 'Groceries', icon: 'fa-solid fa-cart-shopping' },
        { id: 3, name: 'Chores', icon: 'fa-solid fa-broom' },
        { id: 4, name: 'Payments', icon: 'fa-solid fa-money-bill' }
    ])
    const categories = ref([])
    

    // ===== METHODS =====
    const cancelNewTaskDialog = (cancelNewTaskDialog) => {
        openNewTaskDialog.value = cancelNewTaskDialog
    }
    const cancelNewCategoryDialog = (cancelNewCategoryDialog) => {
        openNewCategoryDialog.value = cancelNewCategoryDialog
    }
    const saveNewTodo = () => {
        openNewTaskDialog.value = false
        notification('positive', 'Task successfully saved!')
    }
    const saveNewCategory    = () => {
        openNewCategoryDialog.value = false
        notification('positive', 'Category successfully saved!')
        fetchCategories()
    }
    
    // API calls
    const fetchCategories = async () => {
        try {
            const response = await fetch('/categories/all', { params: { userId: userInfo.value._id } })
            console.log('fetch cats', response)
            categories.value = response
        } catch (err) {
            console.error('Fetch failed:', err)
        }
    }
    
    // ===== COMPUTED PROPERTIES =====
    const displayUserName = computed(() => {
        return userInfo.value?.first_name || 'User'
    })
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
        fetchCategories()
    })

</script>

<style scoped>
.category-card {
    background-color: #222c41;
    /* border-radius: 16px; */
    transition: all 0.3s ease;
}
.dashboard-stat {
    background-color: #152031;
    border: 1px solid #1d2837;
}
 
/* .category-card:hover {
    background-color: #353847;
    transform: translateY(-4px);
}
 
.bg-card-dark {
    background-color: #2a2d3a;
} */
</style>