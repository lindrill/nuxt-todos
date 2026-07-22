<template>
    <q-card style="width: 500px; padding: 10px 20px 20px 20px;" class="category-form">
        <q-form @submit="updateCategory">
            <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
                <div class="text-h6">Edit Category</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="cancelEditCategoryDialog" />
            </q-card-section>
            <q-card-section class="q-mx-md">
                <div class="q-my-sm">
                    <label for="title">Category Name</label>
                    <q-input outlined v-model="clonedCategory.title" color="amber-6" lazy-rules :rules="[rules.required]" class="q-mt-sm"/>
                </div>
                <div class="q-my-sm">
                    <label for="icon">Icon</label>
                    <ReusablesIconPicker v-model="clonedCategory.icon" class="q-mt-sm"/>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pb-lg q-mr-lg">
                <q-btn flat label="Cancel" color="amber-6" text-color="white" :loading="submitting" :disable="submitting" @click="cancelEditCategoryDialog"/>
                <q-btn type="submit" unelevated icon="save" label="Save Category" color="purple" text-color="white"/>
            </q-card-actions>
        </q-form>
    </q-card>
</template>

<script setup>
    const { fetch } = useApi()
    const { userInfo } = useAuth()

    // ===== REACTIVE VARIABLES =====
    const props = defineProps(['category', 'categories'])
    const emit = defineEmits(['cancelEditCategoryDialog', 'updateCategory'])
    const catOptions = ref(props.categories)
    const clonedCategory = ref({ ...props.category })
    // const newCategory = ref({
    //     title: "",
    //     icon: "",
    //     createdBy: userInfo.value._id
    // })
    const rules = ref({
        required: val => !!val || 'Field is required'
    })
    const submitting = ref(false)
    
    // ===== METHODS =====
    const cancelEditCategoryDialog = () => {
        emit('cancelEditCategoryDialog', false) 
    }
    
    // API calls
    const updateCategory = async () => {
        // submitting.value = true
        // try {
        //     await fetch('/categories/new', {
        //         method: 'POST',
        //         body: clonedCategory.value
        //     })
        //     emit('updateCategory')
        // } catch (err) {
        //     console.error('Add category failed:', err)
        // } finally {
        //     submitting.value = false
        // }

        try {
            console.log('updateCategory', clonedCategory.value)
            await fetch('/categories/'+clonedCategory.value._id, {
                method: 'PATCH',
                body: clonedCategory.value
            })
            emit('updateCategory')
        } catch (err) {
            console.error('update category failed:', err)
        } finally {
            submitting.value = false
        }
    }
</script>