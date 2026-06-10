export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated } = useAuth()

    // If user is authenticated and trying to access login/signup page, redirect to home
    if (isAuthenticated.value && (to.path === '/login' || to.path === '/signUp')) {
        return navigateTo('/')
    }

    if (to.meta.auth === false) return

    // If user is not authenticated and trying to access a protected page, redirect to login
    if(!isAuthenticated.value) {
        return navigateTo('/login')
    }

})