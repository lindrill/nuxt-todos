<template>
    <q-card style="width: 500px; padding: 10px 20px 20px 20px;" class="user-form">
        <q-form @submit="updateUser">
            <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
                <div class="text-h6">Edit User</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="cancelEditUserDialog" />
            </q-card-section>
            <q-card-section class="q-mx-md">
                <div class="q-my-sm">
                    <label for="first_name">First Name</label>
                    <q-input outlined v-model="clonedUser.first_name" color="amber-6" lazy-rules :rules="[rules.required]" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="last_name">Last Name</label>
                    <q-input outlined autogrow v-model="clonedUser.last_name" lazy-rules :rules="[rules.required]" color="amber-6" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="email">Email</label>
                    <q-input type="email" outlined v-model="clonedUser.email" lazy-rules :rules="[rules.required, rules.email]" color="amber-6" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="email">Role</label>
                    <q-select outlined v-model="clonedUser.role" lazy-rules :rules="[rules.required]" :options="options" class="q-mt-sm"/>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pb-lg q-mr-lg"">
                <q-btn flat label="Cancel" color="amber-6" text-color="white" @click="cancelEditUserDialog"/>
                <q-btn type="submit" unelevated icon="save" label="Save User" color="purple" text-color="white"/>
            </q-card-actions>
        </q-form>
    </q-card>
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