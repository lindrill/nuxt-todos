<template>
    <div>
        <div class="row flex-center window-height">
            <div class="col-3 q-pa-md q-gutter-md q-ma-sm">
                <q-card bordered class="my-card flat card-rounded q-pa-md">
                    <q-card-section>
                        <div class="text-h6">Sign Up to Tinker 
                            <q-icon name="fa-solid fa-cloud-bolt" class="q-ml-sm" color="amber-6" size="32px"/>
                        </div>
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section>
                        <q-form @submit="signUp">
                            <div class="q-my-md">
                                <q-input color="amber-6" filled dense v-model="user.first_name" placeholder="First Name" :rules="[rules.required]">
                                </q-input>
                            </div>
                            <div class="q-my-md">
                                <q-input color="amber-6" filled dense v-model="user.last_name" placeholder="Last Name" :rules="[rules.required]">
                                </q-input>
                            </div>
                            <div class="q-my-md">
                                <q-input type="email" color="amber-6" filled dense v-model="user.email" placeholder="Email" :rules="[rules.required, rules.email]">
                                </q-input>
                            </div>
                            <div class="q-my-md">
                                <q-input type="password" color="amber-6" filled dense v-model="user.password" placeholder="Password" :rules="[rules.required, rules.min]">
                                    <template v-slot:prepend>
                                        <q-icon name="fa-solid fa-lock" class="q-mr-sm"/>
                                    </template>
                                </q-input>
                            </div>
                            <div class="q-my-md">
                                <q-input type="password" color="amber-6" filled dense v-model="confirm_password" :rules="[rules.required, rules.matchPwd]" placeholder="Confirm Password">
                                    <template v-slot:prepend>
                                        <q-icon name="fa-solid fa-lock" class="q-mr-sm"/>
                                    </template>
                                </q-input>
                            </div>
                            <q-btn type="submit" color="amber-6" text-color="grey-10" :loading="submitting" :disable="submitting" unelevated class="q-mt-sm login-btn q-py-sm">
                                <div>Sign Up</div>
                            </q-btn>
                        </q-form>
                    </q-card-section>
                </q-card>
            </div>
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