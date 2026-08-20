<template>
    <div class="row flex-center window-height">
        <div class="col-3 q-pa-md q-gutter-md q-ma-sm">
            <q-card bordered class="my-card flat card-rounded q-pa-md sign-up-form">
                <q-card-section>
                    <div class="text-h6">Create <span class="text-amber-6">your account</span>
                        <q-icon name="mdi-thought-bubble-outline" class="q-ml-sm" color="amber-6" size="32px"/>
                    </div>
                    <p class="text-grey-5 text-caption">Join TinkerFlow and take control of your tasks.</p>
                </q-card-section>

                <q-separator inset color="blue-grey-10"/>

                <q-card-section>
                    <q-form @submit="signUp">
                        <div class="q-my-sm">
                            <q-input color="amber-6" filled v-model="user.first_name" placeholder="First Name" :rules="[rules.required]">
                                <template v-slot:prepend>
                                    <q-icon name="fa-regular fa-user" class="q-mr-sm text-grey-4"/>
                                </template>
                            </q-input>
                        </div>
                        <div class="q-my-sm">
                            <q-input color="amber-6" filled v-model="user.last_name" placeholder="Last Name" :rules="[rules.required]">
                                <template v-slot:prepend>
                                    <q-icon name="fa-regular fa-user" class="q-mr-sm text-grey-4"/>
                                </template>
                            </q-input>
                        </div>
                        <div class="q-my-sm">
                            <q-input type="email" color="amber-6" filled v-model="user.email" placeholder="Email" :rules="[rules.required, rules.email]" autocomplete="off">
                                <template v-slot:prepend>
                                    <q-icon name="fa-regular fa-envelope" class="q-mr-sm text-grey-4"/>
                                </template>
                            </q-input>
                        </div>
                        <div class="q-my-sm">
                            <q-input :type="showPassword ? 'text' : 'password'" color="amber-6" filled v-model="user.password" placeholder="Password" :rules="[rules.required, rules.min]">
                                <template v-slot:prepend>
                                    <q-icon name="fa-solid fa-lock" class="q-mr-sm text-grey-4"/>
                                </template>
                                <template v-slot:append>
                                    <q-icon class="cursor-pointer q-ml-sm" @click="showPassword = !showPassword" :name="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" color="blue-grey-5" />
                                </template>
                            </q-input>
                        </div>
                        <div class="q-my-sm">
                            <q-input :type="showConfirmPassword ? 'text' : 'password'" color="amber-6" filled v-model="confirm_password" :rules="[rules.required, rules.matchPwd]" placeholder="Confirm Password">
                                <template v-slot:prepend>
                                    <q-icon name="fa-solid fa-lock" class="q-mr-sm text-grey-4"/>
                                </template>
                                <template v-slot:append>
                                    <q-icon class="cursor-pointer q-ml-sm" @click="showConfirmPassword = !showConfirmPassword" :name="showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" color="blue-grey-5" />
                                </template>
                            </q-input>
                        </div>
                        <q-btn type="submit" color="amber-6" text-color="grey-10" :loading="submitting" :disable="submitting" unelevated class="q-mt-sm signup-btn q-py-sm">
                            <div><span class="signup-btn-text">Sign Up</span><q-icon name="fa-solid fa-arrow-right" class="q-ml-sm" size="xs"/></div>
                        </q-btn>
                    </q-form>
                    <div class="q-mt-lg sign-up-div text-center text-grey-4">
                        <p>Already have an account? <router-link to="/login" class="text-amber-6 sign-up">Log In</router-link></p>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup>

    definePageMeta({
        layout: 'login',
        auth: false
    })

    // ===== REACTIVE VARIABLES =====

    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const user = ref({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    })
    const confirm_password = ref('')
    const rules = ref({
        required: val => !!val || 'Field is required',
        min: val => val.length >= 6 || 'Please use minimum of 6 characters',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid email.'
        },
        emailMatch: () => (`The email and password you entered don't match`),
        matchPwd: v => (v == user.value.password) || 'Password does not match'
    })
    const submitting = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // ===== METHODS =====
    const signUp = async () => {
        submitting.value = true
        try {
            await fetch('/auth/register', {
                method: 'POST',
                body: user.value
            })
            setTimeout(() => {
                submitting.value = false
            }, 2000)
            notification('positive', 'Successful signup! Please login.')
            navigateTo('/login')
        } catch (err) {
            console.error('Signup failed:', err)
        }
    }
</script>

<style scoped>
.signup-btn {
    width: 100%;
}
.signup-btn-text {
    font-size: 16px !important;
}
.forgot-password {
    text-align: right;
}
.sign-up {
    margin-top: 80px;
}
</style>