import { UserOutlined } from "@ant-design/icons";
import { Avatar, Col, List, Row, Space } from "antd";
import Link from "next/link"
import { useRouter } from "next/router";
import { useContext } from "react";
import axios from "../pages/api/axios";
import { ActionsContext } from "../providers/ActionsProvider";
import styles from "../styles/NotiModal.module.css"

export default function NotiModal({ notis }) {
    const { setShowNotiModal, setNoti } = useContext(ActionsContext)
    const router = useRouter()

    const handleNoti = async (noti, index) => {
        const {owner,state, ...newNoti} = noti
        if (noti.state === 0) {
            const res = await axios.put(`notification/update/${noti.id}`, {
                ...newNoti,
                state: 1,
            })
            if (res.success) {

            } else {

            }
        } else {

        }

        setShowNotiModal(false)
        setNoti(prev => {
            const { others } = prev
            
            others[index] = {
                ...newNoti,
                state: 1,
            }
            return {
                ...prev,
                others: others.filter(other => other !== noti.id)
            }
        })
        router.push(noti.link)
    }
    return (
        <List className={styles.notis_list}>
            {notis?.map((noti, index) => {
                return (
                    <List.Item key={index} onClick={() => handleNoti(noti, index)} className={noti.state === 1 ? styles.list_item : styles.waiting_list_item}>
                        <Space>
                            <Avatar src={noti.owner?.avatar} icon={<UserOutlined />} />
                            <Col>
                                <Row>
                                    {noti.content}
                                </Row>
                                <Row style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.2)" }}>
                                    <i>{(new Date(noti.updatedAt)).toLocaleString()}</i>
                                </Row>
                            </Col>
                        </Space>
                    </List.Item>
                )
            })}
        </List>
    )
}