<template>
    <div class="row flex-center window-height">
        <div class="col q-pa-md q-gutter-md q-ma-sm login-page">
            <q-card bordered class="my-card flat card-rounded q-pa-md login-form">
                <q-card-section class="flex items-center column">
                    <div>
                        <q-icon name="mdi-thought-bubble-outline" class="q-mr-sm q-mb-md text-amber-6" size="50px"/>
                        <h4 class="login-brand text-weight-medium">Tinker<span class="text-amber-6">Flow</span></h4>
                    </div>
                </q-card-section>

                <q-separator inset color="blue-grey-10"/>

                <p class="text-center q-mt-lg q-mb-none text-grey-4">Welcome! Please login to continue.</p>

                <q-card-section>
                    <div class="q-my-md">
                        <q-input type="email" color="amber-6" filled v-model="user.email" placeholder="Email" autocomplete="off">
                            <template v-slot:prepend>
                                <q-icon name="fa-regular fa-envelope" class="q-mr-sm text-grey-4"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-my-md">
                        <q-input :type="showPassword ? 'text' : 'password'" color="amber-6" filled v-model="user.password" placeholder="Password">
                            <template v-slot:prepend>
                                <q-icon name="fa-solid fa-lock" class="q-mr-sm text-grey-4"/>
                            </template>
                            <template v-slot:append>
                                <q-icon class="cursor-pointer" @click="showPassword = !showPassword" :name="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" color="blue-grey-5" />
                            </template>
                        </q-input>
                    </div>
                    <div class="q-my-md forgot-password cursor-pointer q-hoverable">
                        <p @click="forgotPassword" class="text-amber-6">Forgot Password?</p>
                    </div>
                    <q-btn @click="login" :loading="submitting" :disable="submitting" color="amber-6" text-color="grey-10" unelevated class="q-mt-sm login-btn q-py-sm">
                        <span class="text-weight-medium">Login</span>
                    </q-btn>
                    <div class="q-mt-lg sign-up-div text-center text-grey-4">
                        <p>Don't have an account? <router-link to="/signUp" class="text-amber-6 sign-up">Sign Up</router-link></p>
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
    const { loginUser, isAuthenticated } = useAuth()
    const $q = useQuasar()
    const { notification } = useTrigger()

    const user = ref({
        email: ref(''),
        password: ref('')
    })
    const submitting = ref(false)
    const showPassword = ref(false)

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
        navigateTo('/forgotPassword')
    }
</script>

<style scoped>
.login-page {
    max-width: 550px !important;
}
.login-btn {
    width: 100%;
}
.login-btn span {
    font-size: 17px !important;
}
.forgot-password {
    text-align: right;
}
.sign-up-div {
    margin-top: 80px;
}
.sign-up {
    text-decoration: none;
}
.login-brand {
    display: inline;
    letter-spacing: -0.01em;
}
</style>