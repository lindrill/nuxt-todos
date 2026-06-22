<template>
    <q-card class="my-card menu" flat rounded-borders>
        <q-card-section>
            <q-list>
                <q-item clickable v-ripple to="/">
                    <q-item-section avatar>
                        <q-icon color="blue-grey-4" size="22px" name="fa-solid fa-chart-column" />
                    </q-item-section>

                    <q-item-section>Dashboard</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/todos">
                    <q-item-section avatar>
                    <q-icon color="blue-grey-4" size="22px" name="fa-regular fa-clipboard" />
                    </q-item-section>

                    <q-item-section>Todos</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/users">
                    <q-item-section avatar>
                    <q-icon color="blue-grey-4" size="22px" name="fa-solid fa-people-group" />
                    </q-item-section>
                    

                    <q-item-section>Users</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/settings">
                    <q-item-section avatar>
                    <q-icon color="blue-grey-4" size="22px" name="fa-solid fa-gear" />
                    </q-item-section>

                    <q-item-section>Settings</q-item-section>
                </q-item>

                <q-separator />

                <q-item>
                    <q-item-section avatar>
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>{{ loggedUser }}</q-item-section>
                    <q-btn-dropdown size="12px" flat dense round dropdown-icon="arrow_drop_down">
                        <q-list>
                            <q-item clickable v-close-popup @click="changePassword">
                                <q-item-section avatar>
                                     <i class="fa-solid fa-lock"></i>
                                </q-item-section>
                                <q-item-section class="mx-none">
                                    <q-item-label>Change password</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup @click="logout">
                                <q-item-section avatar>
                                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>Logout</q-item-label>
                                </q-item-section>
                                <q-item-section side v-if="submitting">
                                    <q-spinner-tail color="primary" size="20px" />
                                    <q-tooltip :offset="[0, 8]">QSpinnerTail</q-tooltip>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-item>

                <q-separator />
            </q-list>
        </q-card-section>
    </q-card>
    <q-dialog v-model="openChangePasswordDialog" backdrop-filter="blur(4px)" persistent>
        <UsersChangePassword :page="'profile'" :user="userInfo" @cancelChangePasswordDialog="cancelChangePasswordDialog" @updatePassword="updatePassword"/>
    </q-dialog>
</template>

<script setup>
    // ===== REACTIVE VARIABLES =====
    const { userInfo, logoutUser, restoreUserInfo } = useAuth()
    const { notification } = useTrigger()
    
    const submitting = ref(false)
    const openChangePasswordDialog = ref(false)

     // ===== METHODS =====
    const logout = async () => {
        try {
            submitting.value = true
            await logoutUser()
        } catch (err) {
            console.error('Logout failed:', err)
        } finally {
            navigateTo('/login')
            submitting.value = false
        }
    }
    const changePassword = () => {
        openChangePasswordDialog.value = true
    }
    const cancelChangePasswordDialog = () => {
        openChangePasswordDialog.value = false
    }
    const updatePassword = () => {
        openChangePasswordDialog.value = false
        notification('positive', 'Password changed successfully!')
    }

    // ===== COMPUTED PROPERTIES =====
    const loggedUser = computed(() => {
        return userInfo.value ? userInfo.value.first_name + ' ' + userInfo.value.last_name : 'Loading...'
    })

    // ===== LIFECYCLE HOOKS =====
    onMounted(() => {
        restoreUserInfo()
    })
</script>

<style scoped>

</style>