export const useTrigger = () => {
    const $q = useQuasar()

    const notification = (type, msg) => {
        $q.notify({
            type: type,
            message: msg
        })
    }
  
    return { notification }
}