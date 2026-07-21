<template>
    <q-card style="width: 500px; padding: 10px 20px 20px 20px;" class="category-form">
        <q-form @submit="saveNewCategory">
            <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
                <div class="text-h6">New Category</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="cancelNewCategoryDialog" />
            </q-card-section>
            <q-card-section class="q-mx-md">
                <div class="q-my-sm">
                    <label for="title">Category Name</label>
                    <q-input outlined v-model="newCategory.title" color="amber-6" lazy-rules :rules="[rules.required]" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="icon">Icon</label>
                    <ReusablesIconPicker v-model="newCategory.icon" class="q-mt-sm"/>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pb-lg q-mr-lg">
                <q-btn flat label="Cancel" color="amber-6" text-color="white" :loading="submitting" :disable="submitting" @click="cancelNewCategoryDialog"/>
                <q-btn type="submit" unelevated icon="save" label="Save Category" color="purple" text-color="white"/>
            </q-card-actions>
        </q-form>
    </q-card>
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