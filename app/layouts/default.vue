<template>
    <div>
        <header>
            <nav>
                <!-- <ul>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/settings">Settings</NuxtLink></li>
                </ul> -->
            </nav>
        </header>
        <!-- page area -->
        <div>
            <div class="row">
                <SharedMenu />
                <slot />
                <SharedSidebar :todos="todos" :calendarAttributes="calendarAttributes"/>
            </div>
            <!-- <slot /> -->
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        middleware: ['auth'], // or middleware: 'auth'
    })

    const { fetch, apiBase } = useApi()
    const { userInfo, isAuthenticated } = useAuth()
    // const calendarAttributes = ref([])
    // const todos = ref([])

    const { todos, calendarAttributes, fetchSidebarData } = useSidebarData()


    // API calls
    // const fetchTodos = async () => {
    //     try {
    //         const response = await fetch('/todos/all', { params: { userId: userInfo.value._id, keyword: '' } })
    //         todos.value = response.todos
    //         calendarAttributes.value = response.calendarAttributes
    //     } catch (err) {
    //         console.error('Fetch failed:', err)
    //     }
    // }

    // ===== LIFECYCLE HOOKS =====
    onMounted(() => {
        fetchSidebarData()
    })
</script>
