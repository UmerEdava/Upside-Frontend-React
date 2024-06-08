import { ChangeEvent, useState } from 'react'
import useShowToast from './useShowToast'

const usePreviewImg = () => {

    const [imgUrl, setImgUrl] = useState('')

    const showToast = useShowToast()

    const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files?.[0] || null
        console.log("🚀 ~ handleImgChange ~ file:", file)

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImgUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            showToast('Invalid type', 'Please select an image file', 'error', 3000, false)
            setImgUrl('')
        }

        setImgUrl(e.target.value)
    }



  return (
    {handleImgChange, imgUrl, setImgUrl}
  )
}

export default usePreviewImg