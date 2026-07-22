<template>
    <div class="row">
        <SharedMenu />
        <div class="col-6">
            <div class="page-header row justify-between q-mt-lg q-px-md">
                <div>
                    <h6 class="page-title q-mt-md q-mb-none">Users</h6>
                    <span class="text-body2 text-white">Manage and organize your team members.</span>
                </div>
                <div>
                    <q-btn color="amber-6" text-color="grey-10" rounded class="q-mt-md" @click="openNewUserDialog = true">
                        <q-icon left size="1em" name="fa-solid fa-plus" />
                        <div>New User</div>
                    </q-btn>
                </div>
            </div>
            <div class="q-px-md q-col-gutter-sm">
                <div class="q-mt-md q-mb-lg users-filters">
                    <div class="row items-start q-ml-none q-px-none q-mt-md">
                        <q-input
                            v-model="searchQuery"
                            dense
                            dark
                            outlined
                            placeholder="Search users..."
                            class="search-input q-mr-md"
                            style="width: 300px;"
                            debounce="500"
                        >
                            <template v-slot:append>
                                <q-icon name="search" color="grey-4" />
                            </template>
                        </q-input>
                        <q-select
                            outlined
                            v-model="selectedRole"
                            :options="roles"
                            dense
                            style="width: 150px;"
                            >
                            <template v-slot:prepend>
                                <q-icon name="fa-solid fa-user-group" size="18px" color="white" text-color="white" class="q-mr-sm" />
                            </template>
                        </q-select>
                    </div>
                </div>
                <div class="q-pa-sm">
                    <q-table 
                        :rows="users" 
                        row-key="name" 
                        :columns="columns" 
                        :loading="loading"
                        :pagination="pagination"
                        flat 
                        bordered
                        no-data-label="I didn't find anything for you"
                        no-results-label="The filter didn't uncover any results"
                        class="users-table">
                        <template v-slot:body-cell-name="props">
                            <q-td :props="props">
                                <q-avatar color="deep-purple" text-color="white" size="28px">
                                    {{ getNameInitials(props.row) }}
                                </q-avatar>
                                <span class="q-ml-md">{{ props.row?.first_name +' '+ props.row?.last_name }}</span>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn @click="editUser(props.row)" flat round dense icon="fa-solid fa-pen-to-square" color="green" size="md">
                                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Edit User</q-tooltip>
                                </q-btn>
                                <q-btn @click="changePassword(props.row)" flat round dense icon="fa-solid fa-unlock" color="amber-6" size="md">
                                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Change Password</q-tooltip>
                                </q-btn>
                                <q-btn @click="removeUser(props.row)" flat round dense icon="fa-regular fa-trash-can" color="red" size="md">
                                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Delete User</q-tooltip>
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
        <q-dialog v-model="openNewUserDialog" backdrop-filter="blur(4px)" persistent>
            <UsersNewUser @cancelNewUserDialog="cancelNewUserDialog" @saveNewUser="saveNewUser"/>
        </q-dialog>
        <q-dialog v-model="openEditUserDialog" backdrop-filter="blur(4px)" persistent>
            <UsersEditUser :user="user" @cancelEditUserDialog="cancelEditUserDialog" @updateUser="updateUser"/>
        </q-dialog>
        <q-dialog v-model="openDeleteDialog" backdrop-filter="blur(4px)" persistent>
            <ReusablesDeleteDialog :item="user" :table="'users'" @cancelDeleteDialog="cancelDeleteDialog" @deleteItem="deleteUser"/>
        </q-dialog>
        <q-dialog v-model="openChangePasswordDialog" backdrop-filter="blur(4px)" persistent>
            <UsersChangePassword :user="user" @cancelChangePasswordDialog="cancelChangePasswordDialog" @updatePassword="updatePassword"/>
        </q-dialog>
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
        { name: 'name', required: true, label: 'NAME', align: 'left', sortable: true },
        { name: 'email', label: 'EMAIL', align: 'left', field: 'email', classes: 'text-blue-grey-4', sortable: true },
        { name: 'role', label: 'ROLE', align: 'left',field: 'role' },
        { name: 'actions', label: 'ACTIONS', align: 'center' }
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
    const openChangePasswordDialog = ref(false)
    const user = ref([])
    const searchQuery = ref('')
    const selectedRole = ref('All')
    const roles = ref(['All', 'Admin', 'Member'])
    
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
    const cancelChangePasswordDialog = (cancelChangePasswordDialog) => {
        openChangePasswordDialog.value = cancelChangePasswordDialog
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
    const changePassword = (selectedUser) => {
        user.value = selectedUser
        openChangePasswordDialog.value = true
    }
    const updatePassword = () => {
        openChangePasswordDialog.value = false
        notification('positive', 'User password successfully changed!')
        fetchUsers()
    }
    const getNameInitials = (user) => {
        const name = user.first_name + ' ' + user.last_name
        return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
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
.users-table {
    border-radius: 10px;
    background-color: #152031;
    color: white;
    border: 1px solid #1c2737;
}
</style>
<style>
.users-filters .q-select .q-field__append .q-icon{
    color: #ffffff !important;
}
.users-filters .q-select .q-field__native {
    color: #ffffff !important;
}
.users-filters .q-field--outlined .q-field__control:hover:before {
    border-color: #7a909c !important;
    border-width: 1px !important;
}
.users-filters .q-field--outlined .q-field__control:after {
    border-color: #7a909c !important;
    border-width: 1px !important;
}
.users-table .q-table thead tr,
.users-table .q-table tbody td,
.users-table .q-table th,
.users-table .q-table td {
    border-color: #1c2737 !important;
}
.users-table .q-table__bottom {
    color: white !important;
}
 
.users-table .q-table__control {
    color: white !important;
}
 
.users-table .q-select .q-field__native {
    color: white !important;
}
 
.users-table .q-select .q-field__label {
    color: white !important;
}
.users-table .q-select .q-field__append .q-icon {
    color: white !important;
}
</style>