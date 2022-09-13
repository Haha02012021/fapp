import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import { storage } from "../../firebase/config"

export const getAllImages = async (imageListRef) => {
    const items = await listAll(imageListRef).then((res) => {
        return res.items
    })

    const imgList = []
    for (let i = 0; i < items.length; i++) {
        await getDownloadURL(items[i]).then((url) => {
            imgList[i] = url
        })
    }

    return imgList
}

export const uploadImage = async (image, folder) => {
    if (!image) {

    } else {
        const imageRef = ref(storage, `${folder}/${image.name}`)

        const url = await uploadBytes(imageRef, image).then((snapshot) => {
            const u = getDownloadURL(snapshot.ref).then(async (url) => {
                
                return url
            })

            return u
        })

        return url
    }
}

export const deleteImage = async (imgUrl) => {
    try {
        if (imgUrl) {
            const imgRef = await storage.refFromURL(imgUrl)
    
            await imgRef.delete()
        }
    } catch (error) {
        
    }
}