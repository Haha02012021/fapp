import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import { storage } from "../../firebase/config"
import { v4 } from "uuid"
import axios from "axios"
import { async } from "@firebase/util"

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
        console.log("No image!");
    } else {
        const imageRef = ref(storage, `${folder}/${image.name}`)

        const url = await uploadBytes(imageRef, image).then((snapshot) => {
            // alert("Image Uploaded")
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