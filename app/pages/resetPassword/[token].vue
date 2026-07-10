<template>
    <div>
        <div class="row flex-center window-height">
            <div class="col-3 q-pa-md q-gutter-md q-ma-sm">
                <!-- Loading state -->
                <q-card v-if="validating" bordered class="my-card flat card-rounded q-pa-md">
                    <q-card-section class="text-center">
                        <q-spinner color="amber-6" size="3em" />
                        <p class="q-mt-md">Validating reset link...</p>
                    </q-card-section>
                </q-card>
 
                <!-- Invalid/Expired token -->
                <q-card v-else-if="!isValidToken" bordered class="my-card flat card-rounded q-pa-md">
                    <q-card-section class="text-center">
                        <q-icon name="fa-solid fa-circle-exclamation" size="64px" color="negative" />
                        <p class="text-h6 q-mt-md">Invalid or Expired Link</p>
                        <p>This password reset link is invalid or has expired.</p>
                        <p class="text-caption">Reset links are valid for 1 hour.</p>
                        <q-btn color="amber-6" text-color="grey-10" to="/forgotPassword" class="q-mt-md">
                            Request New Link
                        </q-btn>
                        <q-btn flat color="grey-7" to="/login" class="q-mt-md q-ml-sm">
                            Back to Login
                        </q-btn>
                    </q-card-section>
                </q-card>
                
                <q-form v-else @submit="resetPassword">
                    <q-card bordered class="my-card flat card-rounded q-pa-md">
                        <q-card-section>
                            <div class="text-h6">Reset Password</div>
                        </q-card-section>

                        <q-separator inset />

                        <q-card-section>
                            <div class="q-my-md">
                                <q-input type="password" filled v-model="user.new_password" placeholder="New Password" color="amber-6" lazy-rules :rules="[rules.required, rules.min]">
                                    <template v-slot:prepend>
                                        <q-icon name="fa-regular fa-envelope" class="q-mr-sm"/>
                                    </template>
                                </q-input>
                                <q-input type="password" filled v-model="user.confirm_password" placeholder="Confirm Password" color="amber-6" lazy-rules :rules="[rules.required, rules.min, rules.matchPwd]">
                                    <template v-slot:prepend>
                                        <q-icon name="fa-regular fa-envelope" class="q-mr-sm"/>
                                    </template>
                                </q-input>
                            </div>
                            <q-btn type="submit" :loading="submitting" :disable="submitting" color="amber-6" text-color="grey-10" unelevated class="q-mt-sm login-btn q-py-sm">
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
    const validating = ref(true)
    const isValidToken = ref(false)
    const rules = ref({
        required: val => !!val || 'Field is required',
        min: val => val.length >= 6 || 'Please use minimum of 6 characters',
        matchPwd: v => (v == user.value.new_password) || 'Password does not match'
    })
    
    // ===== METHODS =====
     // Validate token on page load
    const validateToken = async () => {
        validating.value = true
        try {
            await fetch(`/auth/validateResetToken/${token}`, {
                method: 'GET'
            })
            isValidToken.value = true
        } catch (err) {
            console.error('Token validation failed:', err)
            isValidToken.value = false
        } finally {
            validating.value = false
        }
    }

    
    // API calls
    const resetPassword = async () => {
        submitting.value = true
        try {
            const users = await fetch('/auth/resetPassword/'+token, {
                method: 'POST',
                body: { new_password: user.value.new_password }
            })
            notification('positive', 'Password reset successfully! Redirecting to login...')
            setTimeout(() => {
                navigateTo('/login')
                submitting.value = false
            }, 1500)
        } catch (err) {
            console.error('Change password failed:', err)
            notification('negative', 'Failed to reset password!')
            submitting.value = false
        }
    }

    // ===== LIFECYCLE HOOKS =====
    onMounted(() => {
        validateToken()
    })
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