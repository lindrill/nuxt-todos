<template>
    <div class="col-3 q-pa-md items-start q-mt-sm">
        <q-card class="my-card menu" rounded-borders>
            <q-card-section>

                <q-list>
                    <q-item clickable v-ripple to="/" class="q-mb-sm">
                        <q-item-section avatar>
                            <q-icon color="amber-6" size="40px" name="mdi-thought-bubble-outline" />
                        </q-item-section>
                        <q-item-section class="text-white app-name text-weight-bold">TinkerFlow</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple to="/" active-class="menu-item-active">
                        <q-item-section avatar>
                            <q-icon color="blue-grey-1" size="18px" name="fa-solid fa-house" />
                        </q-item-section>
                        <q-item-section class="text-white">Dashboard</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/todos" active-class="menu-item-active">
                        <q-item-section avatar>
                            <q-icon color="blue-grey-1" size="20px" name="fa-regular fa-clipboard" />
                        </q-item-section>
                        <q-item-section class="text-white">Todos</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/categories" active-class="menu-item-active">
                        <q-item-section avatar>
                            <q-icon color="blue-grey-1" size="22px" name="mdi-view-grid-outline" />
                        </q-item-section>
                        <q-item-section class="text-white">Categories</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/users" active-class="menu-item-active">
                        <q-item-section avatar>
                            <q-icon color="blue-grey-1" size="22px" name="mdi-account-multiple-outline" />
                        </q-item-section>
                        <q-item-section class="text-white">Users</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/settings" active-class="menu-item-active">
                        <q-item-section avatar>
                            <q-icon color="blue-grey-1" size="22px" name="mdi-cog-outline" />
                        </q-item-section>
                        <q-item-section class="text-white">Settings</q-item-section>
                    </q-item>

                    <q-separator color="blue-grey-10" class="q-my-sm"/>

                    <q-item>
                        <q-item-section avatar>
                            <q-avatar>
                                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section class="text-white">{{ loggedUser }}</q-item-section>
                        <q-btn-dropdown size="12px" color="white" flat dense round dropdown-icon="arrow_drop_down">
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
                </q-list>
            </q-card-section>
        </q-card>
    </div>
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
.menu {
    min-height: 100dvh;
    background-color: #152031;
}
.app-name {
    font-size: 1.25rem;
    letter-spacing: 0.5px;
}
.menu-item-active {
    background-color: #26303f !important;
    border-right: 4px solid #ffc107; /* amber accent */
    border-radius: 5px;
}
.menu-item-active .q-icon {
    color: #ffc107 !important;
}
</style>