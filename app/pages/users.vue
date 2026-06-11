<template>
    <div>
        <div class="row">
            <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
                <SharedMenu />
            </div>
            <div class="col-6">
                <div class="page-header row justify-between q-mt-md q-px-md">
                    <h6 class="page-title">Users</h6>
                    <div class="q-mt-lg">
                        <q-btn color="amber-7" text-color="grey-10" rounded class="q-mt-md" @click="openNewUserDialog = true">
                            <q-icon left size="1em" name="fa-solid fa-plus" />
                            <div>New User</div>
                        </q-btn>
                    </div>
                </div>
                <div class="q-px-md q-col-gutter-sm">
                    <q-card class="my-card bg-layer card-rounded">
                        <q-card-section>
                            <div class="q-pa-md">
                                <q-table 
                                    :rows="users" 
                                    row-key="name" 
                                    :columns="columns" 
                                    :loading="loading"
                                    :pagination="pagination"
                                    flat 
                                    bordered
                                    no-data-label="I didn't find anything for you"
                                    no-results-label="The filter didn't uncover any results">
                                    <template v-slot:body-cell-actions="props">
                                        <q-td :props="props">
                                            <q-btn @click="editUser(props.row)" flat round dense icon="edit" color="primary" size="md" />
                                            <q-btn @click="removeUser(props.row)" flat round dense icon="delete" color="negative" size="md" />
                                        </q-td>
                                    </template>
                                </q-table>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
        <div>
            <q-dialog v-model="openNewUserDialog" backdrop-filter="blur(4px)" persistent>
                <UsersNewUser @cancelNewUserDialog="cancelNewUserDialog" @saveNewUser="saveNewUser"/>
            </q-dialog>
            <q-dialog v-model="openEditUserDialog" backdrop-filter="blur(4px)" persistent>
                <UsersEditUser :user="user" @cancelEditUserDialog="cancelEditUserDialog" @updateUser="updateUser"/>
            </q-dialog>
            <q-dialog v-model="openDeleteDialog" backdrop-filter="blur(4px)" persistent>
                <ReusablesDeleteDialog :item="user" :table="'users'" @cancelDeleteDialog="cancelDeleteDialog" @deleteItem="deleteUser"/>
            </q-dialog>
        </div>
    </div>
</template>

<script setup>
    import { useQuasar } from 'quasar'
    
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const { userInfo, isAuthenticated } = useAuth()

    // ===== REACTIVE VARIABLES =====
    const users = ref([])
    const loading = ref(false)
    const columns = [
        { name: 'first_name', required: true, label: 'First Name', align: 'left', field: row => row.first_name, sortable: true },
        { name: 'last_name', align: 'left', label: 'Last Name', field: 'last_name', sortable: true },
        { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
        { name: 'role', label: 'Role', align: 'left',field: 'role' },
        { name: 'actions', label: 'Actions', align: 'center' }
    ]
    const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
    })
    const openNewUserDialog = ref(false)
    const openEditUserDialog = ref(false)
    const openDeleteDialog = ref(false)
    const user = ref([])
    
    // ===== METHODS =====
    const cancelNewUserDialog = (cancelNewUserDialog) => {
        openNewUserDialog.value = cancelNewUserDialog
    }
    const cancelEditUserDialog = (cancelEditUserDialog) => {
        openEditUserDialog.value = cancelEditUserDialog
    }
    const cancelDeleteDialog = (cancelDeleteDialog) => {
        openDeleteDialog.value = cancelDeleteDialog
    }
    const saveNewUser = () => {
        openNewUserDialog.value = false
        notification('positive', 'User successfully added!')
        fetchUsers()
    }
    const editUser = (selectedUser) => {
        console.log('editUser', selectedUser)
        user.value = selectedUser
        openEditUserDialog.value = true
    }
    const updateUser = () => {
        openEditUserDialog.value = false
        notification('positive', 'User successfully updated!')
        fetchUsers()
    }
    const removeUser = (selectedUser) => {
        console.log('removeUser', selectedUser)
        user.value = selectedUser
        openDeleteDialog.value = true
    }
    const deleteUser = () => {
        openDeleteDialog.value = false
        notification('positive', 'User successfully deleted!')
        fetchUsers()
    }
    
    // API calls
    const fetchUsers = async () => {
        try {
            const response = await fetch('/users/all')
            console.log('fetch users', response)
            users.value = response
        } catch (err) {
            console.error('Fetch failed:', err)
        }
    }
    
    // ===== COMPUTED PROPERTIES =====
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
        fetchUsers()
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