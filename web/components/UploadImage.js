import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import styles from "../styles/UploadImage.module.css"

export default function UploadImage({ image, name, handleChangeImg = () => {} }) {
    const [selectedImg, setSelectedImg] = useState()
    const [preview, setPreview] = useState(image)
    const [isShowActions, setShowActions] = useState(false)

    useEffect(() => {
        setPreview(image)
    }, [image])
    
    useEffect(() => {
        if (selectedImg) {
            const objectUrl = URL.createObjectURL(selectedImg)
            setPreview(objectUrl)

            handleChangeImg(selectedImg)
            return () => URL.revokeObjectURL(objectUrl)
        } else {
            handleChangeImg(selectedImg)
        }

    }, [selectedImg, handleChangeImg])
    
    const handleChangeImage = (e) => {
        setSelectedImg(e.target.files[0])
    }

    const handleRemove = () => {
        setPreview(null)
        setSelectedImg('')
    }

    return (
        <div
            className={styles.uploadimage}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <input
                className={styles.inputfile}
                type="file"
                name={name}
                onChange={handleChangeImage}
                multiple={false}
            />
            {preview ? (
                <>
                    <img
                        alt="preview_image"
                        src={preview}
                        className={styles.preview}
                    />
                    {isShowActions && (
                        <div className={styles.actions}>
                            <div className={styles.actions_content}>
                                <DeleteOutlined className={styles.actions_icon} onClick={handleRemove} />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div><PlusOutlined /></div>
            )}
        </div>
    )
}