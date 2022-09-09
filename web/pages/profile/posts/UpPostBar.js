import { SmileOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Input, Tooltip } from "antd";
import { useContext } from "react";
import styles from "../../../styles/UpPostBar.module.css"
import { ActionsContext } from "../../../providers/ActionsProvider";

export default function UpPostBar({ user }) {
    const { setShowPostFormModal, setCurrentPost } = useContext(ActionsContext)

    const handleShowModal = () => {
        setShowPostFormModal(true)
    }

    const handleIconShowModal = () => {
        setShowPostFormModal(true)
        setCurrentPost({
            tab: "Trạng thái"
        })
    }

    return (
        <>
            <div className={styles.uppost_bar}>
                <div style={{ width: "64px" }}>
                    <Avatar src={user?.avatar} icon={<UserOutlined />} />
                </div>
                <Input autoFocus={false} placeholder="Bạn muốn chia sẻ điều gì?" onMouseDown={handleShowModal} />
                <div
                    style={{ width: "32px", display: "flex", justifyContent: "end", }}
                >
                    <Tooltip title="Cảm xúc của bạn">
                        <SmileOutlined onClick={handleIconShowModal} style={{ fontSize: "16px" }} />
                    </Tooltip>
                </div>
            </div>
        </>
    )
}