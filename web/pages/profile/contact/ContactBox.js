import { SmileOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Comment, Row } from "antd";
import { useContext } from "react";
import RichEditor from "../../../components/RichEditor";
import { UserContext } from "../../../providers/UserProvider";

export default function ContactBox() {
    const { user } = useContext(UserContext)

    const handleChangeEditor = (values) => {

    }

    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "16px",
                position: "relative",
                width: "100%",
            }}
        >
            <Comment
                avatar={<Avatar src={user?.avatar} icon={<UserOutlined />} alt={user?.username} />}
                content={
                    <div style={{ width: "100%" }}>
                        <Row gutter={[24]} style={{ marginLeft: "4px" }}>
                            <Col
                                style={{
                                    minHeight: "80px",
                                    padding: "8px",
                                    border: "2px solid rgba(0, 0, 0, 0.06)",
                                    borderRadius: "4px",
                                    width: "100%",
                                    marginBottom: "8px",
                                    maxWidth: "60vw",
                                }}
                                span={23}
                            >
                                <RichEditor
                                    placeholder="Bạn muốn nhắn gửi điều gì?"
                                    onChange={(values) => handleChangeEditor(values)}
                                />
                            </Col>
                            <Col span={1}>
                                <SmileOutlined style={{ fontSize: "20px" }} />
                            </Col>
                        </Row>
                        <Row gutter={[24]} style={{ marginLeft: "4px" }}>
                            <Col span={23} style={{ display: "flex", justifyContent: "end" }}>
                                <Button type="primary">Gửi</Button>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    </div>
                }
            />
        </div>
    )
}