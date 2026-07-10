<template>
    <div>
        <q-card style="width: 500px">
            <q-form @submit="updatePassword">
                <q-card-section class="q-mx-md">
                    <div class="text-h6 q-my-lg q-pb-sm">Change Password for {{ props.user.first_name }} {{ props.user.last_name }}</div>
                    <div class="q-my-sm" v-if="props.page === 'profile'">
                        <label for="first_name">Current Password</label>
                        <q-input type="password" filled v-model="clonedUser.current_password" color="amber-6" lazy-rules debounce="500" :rules="[rules.required, rules.verifyCurrentPwd]"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="first_name">New Password</label>
                        <q-input type="password" filled v-model="clonedUser.new_password" color="amber-6" lazy-rules debounce="500" :rules="[rules.required, rules.min, rules.verifyUniqueNewPwd]"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="first_name">Confirm New Password</label>
                        <q-input type="password" filled v-model="clonedUser.confirm_password" color="amber-6" lazy-rules :rules="[rules.required, rules.min, rules.matchPwd]"/>
                    </div>
                    
                </q-card-section>
                <q-card-actions align="right" class="q-pa-lg">
                    <q-btn flat label="Cancel" color="amber-6" text-color="black" @click="cancelChangePasswordDialog"/>
                    <q-btn type="submit" label="Save" color="amber-6" text-color="black"/>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
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