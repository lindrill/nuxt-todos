<template>
    <div>
        <div class="row flex-center window-height">
            <div class="col-3 q-pa-md q-gutter-md q-ma-sm">
                <q-card bordered class="my-card flat card-rounded q-pa-md">
                    <q-card-section>
                        <div class="text-h6">Login to Tinker 
                            <q-icon name="fa-solid fa-cloud-bolt" class="q-ml-sm" color="amber-7" size="32px"/>
                        </div>
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section>
                        <div class="q-my-md">
                            <q-input type="email" color="amber-7" filled dense v-model="user.email" placeholder="Email">
                                <template v-slot:prepend>
                                    <q-icon name="fa-regular fa-envelope" class="q-mr-sm"/>
                                </template>
                            </q-input>
                        </div>
                        <div class="q-my-md">
                            <q-input type="password" color="amber-7" filled dense v-model="user.password" placeholder="Password">
                                <template v-slot:prepend>
                                    <q-icon name="fa-solid fa-lock" class="q-mr-sm"/>
                                </template>
                            </q-input>
                        </div>
                        <div class="q-my-md forgot-password cursor-pointer q-hoverable">
                            <p @click="forgotPassword" >Forgot Password?</p>
                        </div>
                        <q-btn @click="login" :loading="submitting" :disable="submitting" color="amber-7" text-color="grey-10" unelevated class="q-mt-sm login-btn q-py-sm">
                            <div>Login</div>
                        </q-btn>
                        <div class="q-mt-lg sign-up">
                            <p>Don't have an account? <router-link to="/signUp">Sign Up</router-link></p>
                        </div>
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
    const { loginUser, isAuthenticated } = useAuth()
    const $q = useQuasar()
    const { notification } = useTrigger()

    const user = ref({
        email: ref(''),
        password: ref('')
    })
    const submitting = ref(false)

    // ===== METHODS =====

    const login = async () => {
        submitting.value = true
        try {
            await loginUser(user.value)
            navigateTo('/')
        } catch (err) {
            notification('negative', 'Username or password is incorrect')
        } finally {
            submitting.value = false
        }
    }
    const forgotPassword = () => {
        
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