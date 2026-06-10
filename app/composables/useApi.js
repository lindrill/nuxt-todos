export const useApi = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase
    const token = useCookie('tinker_auth_token')

    const fetch = async (endpoint, options = {}) => {

        const headers = {
            ...options.headers,
        }

        // Add Authorization header if token exists
        if (token.value) {
            headers.Authorization = `Bearer ${token.value}`
        }

        return await $fetch(`${apiBase}${endpoint}`, {
            ...options,
            headers
        })
    }
  
    return { fetch, apiBase }
}