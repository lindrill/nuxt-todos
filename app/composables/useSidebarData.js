export const useSidebarData = () => {
    const { fetch } = useApi()
    const { userInfo } = useAuth()

    const todos = useState('sidebar-todos', () => [])
    const calendarAttributes = useState('sidebar-calendar-attributes', () => [])

    const fetchSidebarData = async () => {
        try {
            const response = await fetch('/todos/all', { params: { userId: userInfo.value._id, keyword: '' } })
            console.log('fetchSidebarData', response)
            todos.value = response.todos
            calendarAttributes.value = response.calendarAttributes
        } catch (err) {
            console.error('Fetch sidebar data failed:', err)
        }
    }

    return { todos, calendarAttributes, fetchSidebarData }
}