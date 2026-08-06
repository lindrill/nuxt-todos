<template>
    <q-card class="task-details category-view-card">
        <q-card-section class="row items-center q-pb-none q-mx-md q-my-md">
            <div class="text-h6">Categories</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="cancelViewCategoryDialog" />
        </q-card-section>
        <q-card-section class="q-mx-md">
             <div class="categories-container">
                <div class="row q-col-gutter-lg">
                    <div v-for="category in categories" :key="category._id.category" class="col-3">
                        <q-card class="category-card card-rounded text-center cursor-pointer">
                            <q-card-section class="q-py-lg">
                                <q-icon :name="'fa-solid fa-'+categoryIcon(category)" size="1.5rem" color="white" class="q-mb-sm"/>
                                <div class="text-caption text-weight-medium text-amber-6">{{ category._id.category }}</div>
                                <div class="text-white text-caption">{{ category.count }} {{ category.count === 1 ? 'task' : 'tasks' }}</div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
            <q-btn flat label="Close" color="amber-6" text-color="white" @click="cancelViewCategoryDialog"/>
        </q-card-actions>
    </q-card>
</template>

<script setup>
    const props = defineProps(['categories'])
    const emit = defineEmits(['cancelViewCategoryDialog'])

    // ===== METHODS =====
    const cancelViewCategoryDialog = () => {
        emit('cancelViewCategoryDialog', false) 
    }
    const categoryIcon = (category) => {
        if(category._id.icon) {
            return category._id.icon
        }
        return 'folder'
    }
    
</script>

<style scoped>
.category-view-card {
    width: 900px !important;
    max-width: 900px !important;
    padding: 10px 20px 20px 20px;
}
</style>
