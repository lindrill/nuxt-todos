<template>
    <div>
        <q-card style="width: 500px">
            <q-form @submit="saveNewCategory">
                <q-card-section class="q-mx-md">
                    <div class="text-h6 q-my-lg q-pb-sm">New Category</div>
                    <div class="q-my-sm">
                        <label for="title" >Category Name</label>
                        <q-input filled v-model="newCategory.title" color="amber-7" lazy-rules :rules="[rules.required]"/>
                    </div>
                    <div class="q-my-sm">
                        <label for="icon">Icon</label>
                        <ReusablesIconPicker v-model="newCategory.icon" />
                    </div>
                </q-card-section>
                <q-card-actions align="right" class="q-pa-lg">
                    <q-btn flat label="Cancel" color="amber-7" text-color="black" :loading="submitting" :disable="submitting" @click="cancelNewCategoryDialog"/>
                    <q-btn type="submit" label="Save" color="amber-7" text-color="black"/>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
</template>

<script setup>
    const { fetch } = useApi()
    const { userInfo } = useAuth()

    // ===== REACTIVE VARIABLES =====
    const emit = defineEmits(['cancelNewCategoryDialog', 'saveNewCategory'])
    const newCategory = ref({
        title: "",
        icon: "",
        createdBy: userInfo.value._id
    })
    const rules = ref({
        required: val => !!val || 'Field is required'
    })
    const submitting = ref(false)
    
    // ===== METHODS =====
    const cancelNewCategoryDialog = () => {
        emit('cancelNewCategoryDialog', false) 
    }
    
    // API calls
    const saveNewCategory = async () => {
        submitting.value = true
        try {
            await fetch('/categories/new', {
                method: 'POST',
                body: newCategory.value
            })
            emit('saveNewCategory')
        } catch (err) {
            console.error('Add category failed:', err)
        } finally {
            submitting.value = false
        }
    }
</script>