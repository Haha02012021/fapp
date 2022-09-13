import { MessageOutlined, MessageTwoTone, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Card, List, Space, Tooltip } from "antd"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../providers/UserProvider"
import styles from "../../../styles/TopReactList.module.css"
import axios from "../../api/axios"
import Link from "next/link"

export default function TopReactList({ user }) {
    const { user: authUser } = useContext(UserContext)
    const [threeReactTop, setThreeReactTop] = useState([])

    useEffect(() => {
        const getThreeTop = async (userId) => {
            const res = await axios.get(`post/get-top-3-react?ownerId=${userId}`)
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })
            
            if (res.success) {
                setThreeReactTop(res.data)
            }
        }

        getThreeTop(user?.id)
    }, [user])

    return (
        <Card
            title={`Quan tâm ${user?.id === authUser?.id ? "bạn" : user?.username} nhất`}
            className={styles.top_react_list}
        >
            <List>
                {threeReactTop.map(top => {
                    return (
                        <List.Item key={top.id}>
                            <Space>
                                <Avatar src={top?.avatar} icon={<UserOutlined />} />
                                <div style={{ width: "100%" }} >
                                    <div style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                                        <span>
                                            <Link href={`/profile/detail/${top?.id}`}>
                                                <Tooltip title={`Tìm hiểu ${top?.username}`}>
                                                    <strong style={{ padding: 0, width: "fit-content", cursor: "pointer", }}>{top?.username}</strong>
                                                </Tooltip>
                                            </Link>
                                        </span>
                                        <i style={{ color: "rgba(0, 0, 0, 0.25)", fontSize: "12px", padding: 0, }}>Bày tỏ cảm xúc {top?.reactAmount} bài viết</i>
                                    </div>
                                </div>
                            </Space>
                        </List.Item>
                    )
                })}
            </List>
        </Card>
    )
}