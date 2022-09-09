import { Col, Row } from "antd";
import { useContext } from "react";
import AuthLayout from "../../layout/AuthLayout";
import { UserContext } from "../../providers/UserProvider";
import styles from "../../styles/ChatBox.module.css";
import ChatBoxSideBar from "./ChatBoxSidebar";

export default function ChatIndex() {
    const {user} = useContext(UserContext)

    return (
        <AuthLayout>
            <div
                style={{
                    width: "100%",
                    height: "calc(100vh - 64px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Row
                    gutter={[24]}
                    className={styles.chat_box}
                    style={{
                        width: "80%",
                        height: "90%"
                    }}
                >
                    <Col
                        span={6}
                        style={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.06)",
                            padding: 0,
                            paddingTop: "16px",
                            paddingBottom: "16px",
                        }}
                        className="chat-menu"
                    >
                        <ChatBoxSideBar userId={user?.id} index={true} />
                    </Col>
                    <Col
                        span={18}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            paddingTop: "16px",
                            paddingLeft: "16px",
                            paddingBottom: "16px",
                        }}
                    >
                    </Col>
                </Row>
            </div>
        </AuthLayout>
    )
}