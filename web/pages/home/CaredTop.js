import { UserOutlined } from "@ant-design/icons"
import { Avatar, Card, List, Space, Tooltip } from "antd"
import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "../../styles/TopReactList.module.css"
import axios from "../api/axios"

export default function CaredTop() {
    const [caredTops, setCaredTops] = useState([])
    useEffect(() => {
        const getCaredTops = async () => {
            const res = await axios.get('user/get-cared-tops')
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })
            
            if (res.success) {
                setCaredTops(res.data)
            } else {

            }
        }

        getCaredTops()
    }, [])

    return (
        <Card
            title={`Được quan tâm nhất gần đây`}
            className={styles.top_react_list}
        >
            <List>
                {caredTops?.map(top => {
                    return (
                        <List.Item key={top.id}>
                            <Space>
                                <Avatar src={top?.avatar} icon={<UserOutlined />} />
                                <div style={{ width: "100%" }} >
                                    <div style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                                        <span>
                                            <Link href={`/profile/detail/${top?.id}`}>
                                                <Tooltip title={`Tìm hiểu ${top?.username}`}>
                                                    <strong style={{ padding: 0, width: "fit-content", cursor: "pointer", }}>{top?.fullname}</strong>
                                                </Tooltip>
                                            </Link>
                                        </span>
                                        <i style={{ color: "rgba(0, 0, 0, 0.25)", fontSize: "12px", padding: 0, }}>@{top?.username}</i>
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