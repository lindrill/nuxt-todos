<template>
    <q-card style="width: 500px; padding: 10px 20px 20px 20px;" class="user-form">
        <q-form @submit="saveNewUser">
            <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
                <div class="text-h6">New User</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="cancelNewUserDialog" />
            </q-card-section>
            <q-card-section class="q-mx-md">
                <div class="q-my-sm">
                    <label for="first_name">First Name</label>
                    <q-input outlined v-model="newUser.first_name" color="amber-6" lazy-rules :rules="[rules.required]" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="last_name">Last Name</label>
                    <q-input outlined autogrow v-model="newUser.last_name" lazy-rules :rules="[rules.required]" color="amber-6" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="email">Email</label>
                    <q-input type="email" outlined v-model="newUser.email" lazy-rules :rules="[rules.required, rules.email]" color="amber-6" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="password">Password</label>
                    <q-input type="password" outlined v-model="newUser.password" lazy-rules :rules="[rules.required, rules.min]" color="amber-6" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="email">Role</label>
                    <q-select outlined v-model="newUser.role" lazy-rules :rules="[rules.required]" :options="options" class="q-mt-sm"/>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pb-lg q-mr-lg">
                <q-btn flat label="Cancel" color="amber-6" text-color="white" @click="cancelNewUserDialog"/>
                <q-btn type="submit" unelevated icon="save" label="Save User" color="purple" text-color="white"/>
            </q-card-actions>
        </q-form>
    </q-card>
</template>

<script setup>
    const { fetch, apiBase } = useApi()

    // ===== REACTIVE VARIABLES =====
    const emit = defineEmits(['cancelNewUserDialog', 'saveNewUser'])
    const newUser = ref({
        first_name: "",
        last_name: "",
        email: "",
        role: ""
    })
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
    const cancelNewUserDialog = () => {
        emit('cancelNewUserDialog', false) 
    }
    
    // API calls
    const saveNewUser = async () => {
        newUser.value.role = newUser.value.role.value
        try {
            await fetch('/users/new', {
                method: 'POST',
                body: newUser.value
            })
            emit('saveNewUser')
        } catch (err) {
            console.error('Add user failed:', err)
        }
    }
</script>