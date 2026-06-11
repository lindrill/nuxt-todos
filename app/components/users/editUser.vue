<template>
    <div>
        <q-card style="width: 500px">
            <q-form @submit="updateUser">
                <q-card-section class="q-mx-md">
                    <div class="text-h6 q-my-lg q-pb-sm">Edit User</div>
                    <div class="q-my-sm">
                        <label for="first_name">First Name</label>
                        <q-input filled v-model="clonedUser.first_name" color="amber-7" lazy-rules :rules="[rules.required]"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="last_name">Last Name</label>
                        <q-input filled autogrow v-model="clonedUser.last_name" lazy-rules :rules="[rules.required]" color="amber-7"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="email">Email</label>
                        <q-input type="email" filled v-model="clonedUser.email" lazy-rules :rules="[rules.required, rules.email]" color="amber-7"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="email">Role</label>
                        <q-select filled v-model="clonedUser.role" lazy-rules :rules="[rules.required]" :options="options"/>
                    </div>
                </q-card-section>
                <q-card-actions align="right" class="q-pa-lg">
                    <q-btn flat label="Cancel" color="amber-7" text-color="black" @click="cancelEditUserDialog"/>
                    <q-btn type="submit" label="Save" color="amber-7" text-color="black"/>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
</template>

<script setup>
    const { fetch, apiBase } = useApi()

    // ===== REACTIVE VARIABLES =====
    const emit = defineEmits(['cancelNewUserDialog', 'updateUser'])
    const props = defineProps(['user'])
    const clonedUser = ref({ ...props.user })
    const rules = ref({
        required: val => !!val || 'Field is required',
        min: val => val.length >= 6 || 'Please use minimum of 6 characters',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid email.'
        }
    })
    const options = [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member'}
    ]
    
    // ===== METHODS =====
    const cancelEditUserDialog = () => {
        emit('cancelEditUserDialog', false) 
    }
    
    // API calls
    const updateUser = async () => {
        clonedUser.value.role = clonedUser.value.role.value
        try {
            await fetch('/users/'+props.user._id, {
                method: 'PATCH',
                body: clonedUser.value
            })
            emit('updateUser')
        } catch (err) {
            console.error('Add user failed:', err)
        }
    }
</script>