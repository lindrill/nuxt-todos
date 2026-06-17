<template>
    <div>
        <div class="row flex-center window-height">
            <div class="col-3 q-pa-md q-gutter-md q-ma-sm">
                <q-form @submit="resetPassword">
                    <q-card bordered class="my-card flat card-rounded q-pa-md">
                        <q-card-section>
                            <div class="text-h6">Reset Password</div>
                        </q-card-section>

                        <q-separator inset />

                        <q-card-section>
                            <div class="q-my-md">
                                <q-input type="password" filled v-model="user.new_password" placeholder="New Password" color="amber-7" lazy-rules :rules="[rules.required, rules.min]">
                                    <template v-slot:prepend>
                                        <q-icon name="fa-regular fa-envelope" class="q-mr-sm"/>
                                    </template>
                                </q-input>
                                <q-input type="password" filled v-model="user.confirm_password" placeholder="Confirm Password" color="amber-7" lazy-rules :rules="[rules.required, rules.min, rules.matchPwd]">
                                    <template v-slot:prepend>
                                        <q-icon name="fa-regular fa-envelope" class="q-mr-sm"/>
                                    </template>
                                </q-input>
                            </div>
                            <q-btn type="submit" :loading="submitting" :disable="submitting" color="amber-7" text-color="grey-10" unelevated class="q-mt-sm login-btn q-py-sm">
                                <div>Reset Password</div>
                            </q-btn>
                        </q-card-section>
                    </q-card>
                </q-form>
            </div>
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        layout: 'login',
        auth: false
    })
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const route = useRoute()

    // ===== REACTIVE VARIABLES =====

    const token = route.params.token 
    const user = ref({
        new_password: ref(''),
        confirm_password: ref('')
    })
    const submitting = ref(false)
    const rules = ref({
        required: val => !!val || 'Field is required',
        min: val => val.length >= 6 || 'Please use minimum of 6 characters',
        matchPwd: v => (v == user.value.new_password) || 'Password does not match'
    })
    
    // ===== METHODS =====

    
    // API calls
    const resetPassword = async () => {
        try {
            const users = await fetch('/auth/resetPassword/'+token, {
                method: 'POST',
                body: { new_password: user.value.new_password }
            })
            console.log('users:', users)
            notification('positive', 'Password reset successfully!')
            // navigateTo('/login')
        } catch (err) {
            console.error('Change password failed:', err)
            notification('negative', 'Failed to reset password!')
        }
    }
</script>

<style scoped>
.login-btn {
    width: 100%;
}
.forgot-password {
    text-align: right;
}
.sign-up {
    margin-top: 80px;
}
</style>