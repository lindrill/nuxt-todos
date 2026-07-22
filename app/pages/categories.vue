<template>
    <div class="row">
        <SharedMenu />
        <div class="col-6">
            <div class="page-header row justify-between q-mt-lg q-px-md">
                <div>
                    <h6 class="page-title q-mt-md q-mb-none">Categories</h6>
                    <span class="text-body2 text-white">Organize your tasks with categories.</span>
                </div>
                <div>
                    <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewCategoryDialog = true">
                        <q-icon left size="1em" name="fa-solid fa-plus" />
                        <div>New Category</div>
                    </q-btn>
                </div>
            </div>
            <div class="q-px-md q-col-gutter-sm">
                <div class="q-mt-md q-mb-lg categories-filters">
                    <div class="row items-start q-ml-none q-px-none q-mt-md">
                        <q-input
                            v-model="searchQuery"
                            dense
                            dark
                            outlined
                            placeholder="Search categories..."
                            class="search-input q-mr-md"
                            style="width: 300px;"
                            debounce="500"
                        >
                            <template v-slot:append>
                                <q-icon name="search" color="grey-4" />
                            </template>
                        </q-input>
                         <!-- :options-dense="denseOpts" -->
                        <q-select
                            outlined
                            v-model="selectedUser"
                            :options="users"
                            dense
                            option-value="_id" 
                            :option-label="(user) => getFullName(user)"
                            style="width: 250px;"
                            >
                            <template v-slot:prepend>
                                <q-icon name="fa-solid fa-filter" size="18px" color="white" text-color="white" />
                            </template>
                        </q-select>
                    </div>
                </div>
                <div class="q-pa-sm">
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
                        class="categories-table"
                        >
                        <template v-slot:body-cell-category="props">
                            <q-td :props="props">
                                <div class="row full-width q-mr-lg items-center">
                                    <div class="icon-wrapper q-mr-md">
                                        <q-icon :name="'fa-solid fa-' + props.row.icon" size="20px" color="amber-6" />
                                    </div>
                                    <span class="text-weight-medium">{{ props.row.title }}</span>
                                    <q-chip 
                                        size="sm" 
                                        dense
                                        :style="{ backgroundColor: '#1c2f4c' }" 
                                        text-color="primary"
                                        class="q-ml-sm custom-chip-size"
                                    >
                                        15
                                    </q-chip>
                                </div>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-createdBy="props">
                            <q-td :props="props">
                                <q-avatar color="deep-purple" text-color="white" size="28px">
                                    {{ getNameInitials(props.row.createdBy) }}
                                </q-avatar>
                                <span class="q-ml-sm">{{ props.row.createdBy?.first_name +' '+ props.row.createdBy?.last_name }}</span>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn @click="editCategory(props.row)" flat round dense icon="fa-solid fa-pen-to-square" color="green" size="md">
                                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit Category</q-tooltip>
                                </q-btn>
                                <q-btn @click="removeCategory(props.row)" flat round dense icon="fa-regular fa-trash-can" color="red" size="md">
                                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete Category</q-tooltip>
                                </q-btn>
                            </q-td>
                        </template>
                        
                    </q-table>
                </div>
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
    const users = ref([])
    const loading = ref(false)
    const columns = [
        // { name: 'icon', align: 'left', label: 'ICON', field: 'icon', sortable: true },
        { name: 'category', required: true, label: 'CATEGORY', align: 'left', field: 'title', classes: 'text-weight-bold text-capitalize', sortable: true },
        { name: 'createdAt', label: 'DATE CREATED', align: 'left', field: 'createdAt', field: row => moment(row.createdAt).format('MMM DD, YYYY'), classes: 'text-blue-grey-4', sortable: true },
        { name: 'createdBy', label: 'CREATED BY', align: 'left', field: 'createdBy', field: row => row.createdBy?.first_name + ' ' +  row.createdBy?.last_name, classes: 'text-blue-grey-4', sortable: true },
        { name: 'actions', label: 'ACTIONS', align: 'center' }
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
    const searchQuery = ref('')
    const selectedUser = ref(null)
    
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
    const getFullName = (user) => {
        if (user._id == 'All') {
            return 'All'
        }
        return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown'
    }
    const getNameInitials = (user) => {
        const name = user.first_name + ' ' + user.last_name
        return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
    }
    
    // API calls
    const fetchCategories = async () => {
        try {
            const response = await fetch('/categories/all', { params: { userId: userInfo.value._id } })
            console.log('categegories', response)
            categories.value = response
        } catch (err) {
            console.error('Fetch categories failed:', err)
        }
    }
    const fetchUsers = async () => {
        try {
            const response = await fetch('/users/all')
            console.log('fetch users', response)
            users.value = response
            let allOption = { _id: 'All', last_name: 'All', first_name: '' };
            users.value.unshift(allOption);
            selectedUser.value = users.value[0]
            console.log('all', users.value)
        } catch (err) {
            console.error('Fetch users failed:', err)
        }
    }
    
    // ===== COMPUTED PROPERTIES =====
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
        fetchCategories()
        fetchUsers()
    })

</script>

<style scoped>
.categories-table {
    border-radius: 10px;
    background-color: #152031;
    color: white;
    border: 1px solid #1c2737;
}
.custom-chip-size {
    font-size: 12px !important;
    border-radius: 4px !important;
}
.icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(100, 150, 255, 0.1);
}
</style>
<style>
.categories-filters .q-select .q-field__append .q-icon{
    color: #ffffff !important;
}
.categories-filters .q-select .q-field__native {
    color: #ffffff !important;
}
.categories-filters .q-field--outlined .q-field__control:hover:before {
    border-color: #7a909c !important;
    border-width: 1px !important;
}
.categories-filters .q-field--outlined .q-field__control:after {
    border-color: #7a909c !important;
    border-width: 1px !important;
}
.categories-table .q-table thead tr,
.categories-table .q-table tbody td,
.categories-table .q-table th,
.categories-table .q-table td {
    border-color: #1c2737 !important;
}
.categories-table .q-table__bottom {
    color: white !important;
}
 
.categories-table .q-table__control {
    color: white !important;
}
 
.categories-table .q-select .q-field__native {
    color: white !important;
}
 
.categories-table .q-select .q-field__label {
    color: white !important;
}
.categories-table .q-select .q-field__append .q-icon {
    color: white !important;
}
</style>