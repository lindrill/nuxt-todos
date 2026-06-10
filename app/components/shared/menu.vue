<template>
    <q-card class="my-card menu" flat rounded-borders>
        <q-card-section>
            <q-list>
                <q-item clickable>
                    <q-item-section avatar>
                        <q-icon color="blue-grey-4" size="22px" name="fa-solid fa-chart-column" />
                    </q-item-section>

                    <q-item-section>Dashboard</q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                    <q-item-section avatar>
                    <q-icon color="blue-grey-4" size="22px" name="fa-regular fa-clipboard" />
                    </q-item-section>

                    <q-item-section>Todos</q-item-section>
                </q-item>

                <q-item clickable v-ripple>
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
                    <q-item-section>{{ userInfo?.first_name }} {{ userInfo?.last_name }}</q-item-section>
                    <q-item-section side @click="logout" class="cursor-pointer q-hoverable text-primary" v-if="!submitting">
                        Logout
                    </q-item-section>
                    <q-item-section side v-else>
                        <q-spinner-tail color="primary" size="20px" />
                        <q-tooltip :offset="[0, 8]">QSpinnerTail</q-tooltip>
                    </q-item-section>
                </q-item>

                <q-separator />
            </q-list>
        </q-card-section>
    </q-card>
</template>

<script setup>
    // ===== REACTIVE VARIABLES =====
    const { userInfo, logoutUser } = useAuth()
    const submitting = ref(false)

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
</script>

<style scoped>

</style>