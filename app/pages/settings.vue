<template>
    <div>
        <div class="row">
            <div class="col-3 q-pa-md items-start q-gutter-md q-mt-sm">
                <SharedMenu />
            </div>
            <div class="col-6">
                <div class="page-header row justify-between q-mt-md q-px-md">
                    <h6 class="page-title">Settings</h6>
                    <q-card class="my-card card-rounded bg-layer">
                        <q-card-section>
                            <div class="q-pa-md">
                                <q-splitter v-model="splitterModel">
                                    <template v-slot:before>
                                        <q-tabs v-model="tab" vertical class="text-amber-7" align="left" inline-label>
                                            <q-tab name="users" icon="mail" label="Mails" />
                                            <q-tab name="alarms" icon="alarm" label="Alarms" />
                                            <q-tab name="movies" icon="movie" label="Movies" />
                                        </q-tabs>
                                    </template>

                                    <template v-slot:after>
                                        <q-tab-panels
                                        v-model="tab"
                                        animated
                                        swipeable
                                        vertical
                                        transition-prev="jump-up"
                                        transition-next="jump-up"
                                        >
                                        <q-tab-panel name="mails">
                                            <div class="text-h4 q-mb-md">Mails</div>
                                            <p
                                            >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                                            praesentium cumque magnam odio iure quidem, quod illum numquam
                                            possimus obcaecati commodi minima assumenda consectetur culpa fuga
                                            nulla ullam. In, libero.</p
                                            >
                                            <p
                                            >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                                            praesentium cumque magnam odio iure quidem, quod illum numquam
                                            possimus obcaecati commodi minima assumenda consectetur culpa fuga
                                            nulla ullam. In, libero.</p
                                            >
                                        </q-tab-panel>

                                        <q-tab-panel name="alarms">
                                            <div class="text-h4 q-mb-md">Alarms</div>
                                            <p
                                            >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                                            praesentium cumque magnam odio iure quidem, quod illum numquam
                                            possimus obcaecati commodi minima assumenda consectetur culpa fuga
                                            nulla ullam. In, libero.</p
                                            >
                                            <p
                                            >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                                            praesentium cumque magnam odio iure quidem, quod illum numquam
                                            possimus obcaecati commodi minima assumenda consectetur culpa fuga
                                            nulla ullam. In, libero.</p
                                            >
                                        </q-tab-panel>

                                        <q-tab-panel name="movies">
                                            <div class="text-h4 q-mb-md">Movies</div>
                                            <p
                                            >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                                            praesentium cumque magnam odio iure quidem, quod illum numquam
                                            possimus obcaecati commodi minima assumenda consectetur culpa fuga
                                            nulla ullam. In, libero.</p
                                            >
                                            <p
                                            >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                                            praesentium cumque magnam odio iure quidem, quod illum numquam
                                            possimus obcaecati commodi minima assumenda consectetur culpa fuga
                                            nulla ullam. In, libero.</p
                                            >
                                            <p
                                            >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                                            praesentium cumque magnam odio iure quidem, quod illum numquam
                                            possimus obcaecati commodi minima assumenda consectetur culpa fuga
                                            nulla ullam. In, libero.</p
                                            >
                                        </q-tab-panel>
                                        </q-tab-panels>
                                    </template>
                                    </q-splitter>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="row justify-between q-px-md">
                    
                </div>
            </div>
            <div class="col-3 q-pa-md row q-gutter-md">
            </div>
        </div>
        <div>
            <!-- <q-dialog v-model="openNewTaskDialog" backdrop-filter="blur(4px)" persistent>
                <TasksNewTask @cancelNewTaskDialog="cancelNewTaskDialog" @saveNewTodo="saveNewTodo"/>
            </q-dialog> -->
        </div>
    </div>
</template>

<script setup>
    import { useQuasar } from 'quasar'
    
    // ===== REACTIVE VARIABLES =====
    const $q = useQuasar()
    const { fetch, apiBase } = useApi()
    const { notification } = useTrigger()
    const { userInfo, isAuthenticated } = useAuth()
    const tab = ref('mails')
    const splitterModel = ref(20)
    
    

    // ===== METHODS =====
    
    // API calls
    // const fetchTodos = async () => {
    //     try {
    //         const response = await fetch('/todos/all')
    //         console.log('fetch todos', response)
    //         todos.value = response
    //     } catch (err) {
    //         console.error('Fetch failed:', err)
    //     }
    // }
    
    // ===== COMPUTED PROPERTIES =====
    

    // ===== LIFECYCLE HOOKS =====

    onMounted(() => {
    })

</script>

<style scoped>
.todo-item {
    background-color: white;
}
.todo-rounded {
    border-radius: 10px;
}
</style>