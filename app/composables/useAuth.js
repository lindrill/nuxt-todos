export const useAuth = () => {
    const { fetch } = useApi()
    const cookie = useCookie('tinker_auth_token')
    const token = useState('auth-token', () => null)
    const userInfo = useState('auth-user', () => null)
    
    const loginUser = async (credentials) => {
        const data = await fetch('/auth/login', {
            method: 'POST',
            body: credentials,
            // credentials: 'include' // Important: send cookies with request
        })

        // Handle cookies/localStorage as needed
        token.value = data.token
        userInfo.value = data.user
        cookie.value = data.token
        localStorage.setItem('userInfo', JSON.stringify(data.user));
    }

    const logoutUser = async () => { // Clear cookies/localStorage
        token.value = null
        userInfo.value = null
        cookie.value = null
        localStorage.removeItem('userInfo');
    }
    
    const isAuthenticated = computed(() => !!cookie.value)
    
    return { userInfo, cookie, loginUser, logoutUser, isAuthenticated }
}