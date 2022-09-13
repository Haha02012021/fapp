import { UserOutlined } from "@ant-design/icons";
import { Avatar, Col, List, Row, Space, Tooltip } from "antd";
import { useRouter } from "next/router";
import { reactIcons } from "../constant/reactIcons";
import styles from "../styles/NotiModal.module.css";

export default function ReactsListModal({ reacts }) {
    const router = useRouter()
    return (
        <List>
            {reacts?.map(react => {
                return (
                    <List.Item
                        style={{ width: "100%" }}
                        className={styles.list_item}
                        onClick={() => router.push(`/profile/detail/${react.id}`)}
                    >
                        <Tooltip title={`Xem ${react.username}`}>
                            <Row style={{ width: "100%" }} gutter={[2, 24]}>
                                <Col span={2}>
                                    <Avatar size={40} src={react.avatar} icon={<UserOutlined />} />
                                </Col>
                                <Col span={20}>
                                    <Row>
                                        <b>{react.fullname}</b>
                                    </Row>
                                    <Row>
                                        <i style={{ fontSize: "12px", }}>@{react.username}</i>
                                    </Row>
                                </Col>
                                <Col span={2} style={{ display: "flex", alignItems: "center", }}>
                                    {reactIcons[react.PostsUsers.reactType].icon}
                                </Col>
                            </Row>
                        </Tooltip>
                    </List.Item>
                )
            })}
        </List>
    )
}