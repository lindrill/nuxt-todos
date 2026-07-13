<template>
    <div>
        <div class="row">
            <SharedMenu />
            <div class="col-6">
                <div class="page-header row justify-between q-mt-md q-px-md">
                    <h6 class="page-title">Categories</h6>
                    <div class="q-mt-lg">
                        <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewCategoryDialog = true">
                            <q-icon left size="1em" name="fa-solid fa-plus" />
                            <div>New Category</div>
                        </q-btn>
                    </div>
                </div>
                <div class="q-px-md q-col-gutter-sm">
                    <q-card class="my-card bg-layer card-rounded">
                        <q-card-section>
                            <div class="q-pa-md">
                                <q-table 
                                    :rows="categories" 
                                    row-key="title" 
                                    :columns="columns" 
                                    :loading="loading"
                                    :pagination="pagination"
                                    flat 
                                    bordered
                                    no-data-label="I didn't find anything for you"
                                    no-results-label="The filter didn't uncover any results"
                                    >
                                    <template v-slot:body-cell-icon="props">
                                        <q-td :props="props">
                                            <q-icon :name="'fa-solid fa-' + props.row.icon" size="2em" />
                                        </q-td>
                                    </template>
                                    <template v-slot:body-cell-actions="props">
                                        <q-td :props="props">
                                            <q-btn @click="editCategory(props.row)" flat round dense icon="edit" color="primary" size="md">
                                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit Category</q-tooltip>
                                            </q-btn>
                                            <q-btn @click="removeCategory(props.row)" flat round dense icon="delete" color="negative" size="md">
                                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete Category</q-tooltip>
                                            </q-btn>
                                        </q-td>
                                    </template>
                                </q-table>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <SharedSidebar />
        </div>
        <div>
            <q-dialog v-model="openNewCategoryDialog" backdrop-filter="blur(4px)" persistent>
                <CategoriesNewCategory @cancelNewCategoryDialog="cancelNewCategoryDialog" @saveNewCategory="saveNewCategory"/>
            </q-dialog>
            <q-dialog v-model="openEditCategoryDialog" backdrop-filter="blur(4px)" persistent>
                <CategoriesEditCategory :category="category" :categories="categories" @cancelEditCategoryDialog="cancelEditCategoryDialog" @updateCategory="updateCategory"/>
            </q-dialog>
            <q-dialog v-model="openDeleteDialog" backdrop-filter="blur(4px)" persistent>
                <ReusablesDeleteDialog :item="category" :table="'categories'" @cancelDeleteDialog="cancelDeleteDialog" @deleteItem="deleteCategory"/>
            </q-dialog>
        </div>
    </div>
</template>

<script setup>
    import { useQuasar } from 'quasar'
    import moment from 'moment'
    
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const { userInfo, isAuthenticated } = useAuth()

    // ===== REACTIVE VARIABLES =====
    const categories = ref([])
    const loading = ref(false)
    const columns = [
        { name: 'title', required: true, label: 'Title', align: 'left', field: 'title', classes: 'text-weight-bold text-primary', sortable: true },
        { name: 'icon', align: 'left', label: 'Icon', field: 'icon', sortable: true },
        { name: 'createdAt', label: 'Date Created', align: 'left', field: 'createdAt', field: row => moment(row.createdAt).format('MMM DD, YYYY'), sortable: true },
        { name: 'createdBy', label: 'Created By', align: 'left', field: 'createdBy', field: row => row.createdBy?.first_name + ' ' +  row.createdBy?.last_name, sortable: true },
        { name: 'actions', label: 'Actions', align: 'center' }
    ]
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
    })
    const openNewCategoryDialog = ref(false)
    const openEditCategoryDialog = ref(false)
    const openDeleteDialog = ref(false)
    const category = ref([])
    
    // ===== METHODS =====
    const cancelNewCategoryDialog = (cancelNewCategoryDialog) => {
        openNewCategoryDialog.value = cancelNewCategoryDialog
    }
    const cancelEditCategoryDialog = (cancelEditCategoryDialog) => {
        openEditCategoryDialog.value = cancelEditCategoryDialog
    }
    const cancelDeleteDialog = (cancelDeleteDialog) => {
        openDeleteDialog.value = cancelDeleteDialog
    }
    const saveNewCategory = () => {
        openNewCategoryDialog.value = false
        notification('positive', 'Category successfully added!')
        fetchCategories()
    }
    const editCategory = (selectedCategory) => {
        category.value = selectedCategory
        openEditCategoryDialog.value = true
    }
    const updateCategory = () => {
        openEditCategoryDialog.value = false
        notification('positive', 'Category successfully updated!')
        fetchCategories()
    }
    const removeCategory = (selectedCategory) => {
        category.value = selectedCategory
        openDeleteDialog.value = true
    }
    const deleteCategory = () => {
        openDeleteDialog.value = false
        notification('positive', 'Category successfully deleted!')
        fetchCategories()
    }
    
    // API calls
    const fetchCategories = async () => {
        try {
            const response = await fetch('/categories/all', { params: { userId: userInfo.value._id } })
            console.log('categegories', response)
            categories.value = response
        } catch (err) {
            console.error('Fetch failed:', err)
        }
    }
    
    // ===== COMPUTED PROPERTIES =====
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
        fetchCategories()
    })

</script>

<style scoped>
.todo-item {
    background-color: white;
}
.todo-rounded {
    border-radius: 10px;
}
</style>