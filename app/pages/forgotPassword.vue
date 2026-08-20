<template>
    <div class="row flex-center window-height">
        <div class="col-3 q-pa-md q-gutter-md q-ma-sm">
            <q-form @submit="submitEmail">
                <q-card bordered class="my-card flat card-rounded q-pa-md forgot-password-form">
                    <q-card-section>
                        <div class="text-h6 text-center">Forgot Password</div>
                    </q-card-section>

                    <q-separator inset color="blue-grey-10"/>

                    <q-card-section v-if="!emailSent">
                        <div class="q-my-md">
                            <p class="text-grey-4 q-mb-lg">Please enter your email to receive a password reset link.</p>
                            <q-input type="email" color="amber-6" filled v-model="email" placeholder="Email"  autocomplete="off">
                                <template v-slot:prepend>
                                    <q-icon name="fa-regular fa-envelope" class="q-mr-sm text-grey-4"/>
                                </template>
                            </q-input>
                        </div>
                        <q-btn type="submit" :loading="submitting" :disable="submitting" color="amber-6" text-color="grey-10" unelevated class="q-mt-sm forgot-pwd-btn q-py-sm">
                            <span class="text-weight-medium">Send</span>
                        </q-btn>
                    </q-card-section>
                    <q-card-section v-else>
                        <div class="text-center q-my-md">
                            <q-icon name="fa-solid fa-envelope-circle-check" size="64px" color="positive" />
                            <p class="text-h6 q-mt-md">Check your email!</p>
                            <p class="text-grey-4">We've sent a password reset link to <strong>{{ email }}</strong></p>
                            <p class="text-grey-4 text-caption">Didn't receive it? Check your spam folder.</p>
                            <q-btn flat color="amber-6" @click="emailSent = false">Send again</q-btn>
                            <q-btn flat color="grey-7" to="/login">Back to login</q-btn>
                        </div>
                    </q-card-section>
                </q-card>
            </q-form>
        </div>
    </div>
</template>

<script setup>

    definePageMeta({
        layout: 'login',
        auth: false
    })

    // ===== REACTIVE VARIABLES =====
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()

    const email = ref('')
    const submitting = ref(false)
    const emailSent = ref(false)

    // ===== METHODS =====

    const submitEmail = async () => {
        console.log('submitEmail', email.value)
        submitting.value = true
        try {
            await fetch('/auth/forgotPassword', {
                method: 'POST',
                body: JSON.stringify({ email: email.value })
            })
            emailSent.value = true
            notification('positive', 'Password reset link sent! Please check your email.')
        } catch (err) {
            console.error('Forgot password failed:', err)
            notification('negative', 'Failed to send password reset link. Check your email address.')
        } finally {
            submitting.value = false
        }
    }
</script>

<style scoped>
.forgot-pwd-btn {
    width: 100%;
}
.forgot-pwd-btn span {
    font-size: 17px !important;
}
</style>