import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'

const useShowToast = () => {
    const toast = useToast()

    const showToast = useCallback((title: string, description: string, status: 'info' | 'error' | 'success' | 'warning' | 'loading', duration: number, isClosable: boolean) => {
        toast({
            title,
            description,
            status,
            duration,
            isClosable,
          })
    }, [toast])

    return showToast
}

export default useShowToast