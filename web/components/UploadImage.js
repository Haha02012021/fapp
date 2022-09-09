import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import { Image } from "antd"
import { useEffect, useState } from "react"
import styles from "../styles/UploadImage.module.css"

export default function UploadImage({ image, name, handleChangeImg }) {
    const [selectedImg, setSelectedImg] = useState()
    const [preview, setPreview] = useState(image)
    const [isShowActions, setShowActions] = useState(false)

    useEffect(() => {
        setPreview(image)
    }, [image])
    
    useEffect(() => {
        // create the preview
        if (selectedImg) {
            // console.log(selectedImg);
            const objectUrl = URL.createObjectURL(selectedImg)
            setPreview(objectUrl)

            handleChangeImg(selectedImg)
            // free memory when ever this component is unmounted
            return () => URL.revokeObjectURL(objectUrl)
        } else {
            handleChangeImg(selectedImg)
        }

    }, [selectedImg])
    
    const handleChangeImage = (e) => {
        setSelectedImg(e.target.files[0])
    }

    const handleRemove = () => {
        setPreview(null)
        setSelectedImg('')
    }

    return (
        <div
            class={styles.uploadimage}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <input
                class={styles.inputfile}
                type="file"
                name={name}
                onChange={handleChangeImage}
                multiple={false}
            />
            {preview ? (
                <>
                    <img
                        src={preview}
                        className={styles.preview}
                    />
                    {isShowActions && (
                        <div className={styles.actions}>
                            <div className={styles.actions_content}>
                                {/* <EyeOutlined className={styles.actions_icon} /> */}
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