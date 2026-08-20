<template>
    <q-card style="width: 500px; padding: 20px;" class="user-form">
        <q-form @submit="updatePassword">
            <q-card-section class="q-mx-md">
                <div class="row items-center q-mb-xl">
                    <div class="form-icon-wrapper q-mr-md">
                        <q-icon name="fa-solid fa-lock" size="36px" color="amber-6" />
                    </div>
                    <div class="col">
                        <div class="text-h6">Change Password</div>
                        <div class="text-body2 text-grey-5">for {{ props.user.first_name }} {{ props.user.last_name }}</div>
                    </div>
                </div>
                
                <div class="q-my-sm" v-if="props.page === 'profile'">
                    <label for="first_name">Current Password</label>
                    <q-input :type="showCurrentPassword ? 'text' : 'password'" filled v-model="clonedUser.current_password" color="amber-6" lazy-rules debounce="500" :rules="[rules.required, rules.verifyCurrentPwd]" class="q-mt-sm">
                        <template v-slot:append>
                            <q-icon class="cursor-pointer" @click="showCurrentPassword = !showCurrentPassword" :name="showCurrentPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" color="blue-grey-5" />
                        </template>
                    </q-input>
                </div>
                <div class="q-my-sm">
                    <label for="first_name">New Password</label>
                    <q-input :type="showPassword ? 'text' : 'password'" filled v-model="clonedUser.new_password" color="amber-6" lazy-rules debounce="500" :rules="[rules.required, rules.min, rules.verifyUniqueNewPwd]" class="q-mt-sm">
                        <template v-slot:append>
                            <q-icon class="cursor-pointer" @click="showPassword = !showPassword" :name="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" color="blue-grey-5" />
                        </template>
                    </q-input>
                </div>
                <div class="q-my-sm">
                    <label for="first_name">Confirm New Password</label>
                    <q-input :type="showConfirmPassword ? 'text' : 'password'" filled v-model="clonedUser.confirm_password" color="amber-6" lazy-rules :rules="[rules.required, rules.min, rules.matchPwd]" class="q-mt-sm">
                        <template v-slot:append>
                            <q-icon class="cursor-pointer" @click="showConfirmPassword = !showConfirmPassword" :name="showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" color="blue-grey-5" />
                        </template>
                    </q-input>
                </div>
                
            </q-card-section>
            <q-card-actions align="right" class="q-pb-lg q-mr-lg">
                <q-btn flat icon="close" label="Cancel" color="amber-6" text-color="white" @click="cancelChangePasswordDialog"/>
                <q-btn type="submit" unelevated icon="save" label="Save Password" color="purple" text-color="white"/>
            </q-card-actions>
        </q-form>
    </q-card>
</template>

<script setup>
    const { fetch, apiBase } = useApi() 

    // ===== REACTIVE VARIABLES =====
    const emit = defineEmits(['cancelChangePasswordDialog', 'updatePassword'])
    const props = defineProps(['user', 'page'])
    const clonedUser = ref({ ...props.user })
    const rules = ref({
        required: val => !!val || 'Field is required',
        min: val => val.length >= 6 || 'Please use minimum of 6 characters',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid email.'
        },
        matchPwd: v => (v == clonedUser.value.new_password) || 'Password does not match',
        verifyCurrentPwd: async (val) => {
            if (!val || val.length < 6) return true
            
            try {
                await fetch(`/auth/confirmCurrentPassword/${props.user._id}`, {
                    method: 'PATCH',
                    body: { current_password: val }
                })
                return true
            } catch (err) {
                return err.data?.error || 'Current password is incorrect'
            }
        },
        verifyUniqueNewPwd: async (val) => {
            if (!val || val.length < 6) return true
            
            try {
                await fetch(`/auth/verifyNewPassword/${props.user._id}`, {
                    method: 'PATCH',
                    body: { new_password: val }
                })
                return true
            } catch (err) {
                return err.data?.error || 'Current password is incorrect'
            }
        }
    })
    const showCurrentPassword = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    // ===== METHODS =====
    const cancelChangePasswordDialog = () => {
        emit('cancelChangePasswordDialog', false) 
    }
    
    // API calls
    const updatePassword = async () => {
        // clonedUser.value.password = clonedUser.value.new_password
        try {
            await fetch('/auth/changePassword/'+props.user._id, {
                method: 'PATCH',
                body: { new_password: clonedUser.value.new_password }
            })
            emit('updatePassword')
        } catch (err) {
            console.error('Change password failed:', err)
        }
    }
</script>
<!-- <style scoped>
.task-icon-wrapper {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 193, 7, 0.1);
}
</style> -->