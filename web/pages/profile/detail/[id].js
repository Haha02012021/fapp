import { Button, Col, Layout, List, Row, Typography } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import axios from "../../api/axios";
import { UserContext } from "../../../providers/UserProvider";
import ProfileLayout from "../../../layout/AuthLayout/ProfileLayout";

const { Content, Sider } = Layout

const sexs = ['Nam', 'Nữ', 'Khác'];

const bloodTypes = ["O", "A", "B", "AB"];

export default function ProfileDetail() {
    const router = useRouter()
    const { user: authUser } = useContext(UserContext)
    const [user, setUser] = useState()

    useEffect(() => {
        const { id } = router.query

        if (id) {
            const getUser = async (id) => {
                const res = await axios.get(`user/get/${id}`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    console.log(res.data);
                    setUser(res.data.user)
                } else {
    
                }
            }
    
            getUser(id)
        }
    }, [router])

    return (
        <ProfileLayout user={user}>
            <List
                header={
                    <Typography.Title
                        level={3}
                    >
                        Thông tin chi tiết
                    </Typography.Title>
                }
                footer={
                    <div style={{ width: "100%", display: "flex", justifyContent: "end", }}>
                        {
                            user?.id === authUser?.id ? 
                                (<Button type="primary">Chỉnh sửa</Button>) :
                                (<Button type="primary">Theo dõi</Button>)
                        }
                    </div>
                }
                // bordered
                style={{
                    height: "fit-content",
                    backgroundColor: "white",
                    padding: "20px",
                    paddingLeft: "48px",
                    paddingRight: "48px",
                    borderRadius: "4px",
                }}
            >
                <List.Item>
                    <Row
                        gutter={[2, 24]}
                        style={{
                            width: "100%",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
                        }}
                    >
                        <Col span={8}>
                            Họ và tên
                        </Col>
                        <Col span={16}>
                            {user?.fullname}
                        </Col>
                    </Row>
                </List.Item>
                <List.Item>
                    <Row
                        gutter={[2, 24]}
                        style={{
                            width: "100%",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
                        }}
                    >
                        <Col span={8}>
                            Đối tượng
                        </Col>
                        <Col span={16}>
                            {sexs[user?.toward]}
                        </Col>
                    </Row>
                </List.Item>
                <List.Item>
                    <Row
                        gutter={[2, 24]}
                        style={{
                            width: "100%",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
                        }}
                    >
                        <Col span={8}>
                            Chiều cao
                        </Col>
                        <Col span={16}>
                            {user?.height} cm
                        </Col>
                    </Row>
                </List.Item>
                <List.Item>
                    <Row
                        gutter={[2, 24]}
                        style={{
                            width: "100%",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
                        }}
                    >
                        <Col span={8}>
                            Cân nặng
                        </Col>
                        <Col span={16}>
                            {user?.weight} kg
                        </Col>
                    </Row>
                </List.Item>
                <List.Item>
                    <Row
                        gutter={[2, 24]}
                        style={{
                            width: "100%",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
                        }}
                    >
                        <Col span={8}>
                            Nhóm máu
                        </Col>
                        <Col span={16}>
                            {bloodTypes[user?.bloodType]}
                        </Col>
                    </Row>
                </List.Item>
                <List.Item>
                    <Row
                        gutter={[2, 24]}
                        style={{
                            width: "100%",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
                        }}
                    >                            <Col span={8}>
                            Email
                        </Col>
                        <Col span={16}>
                            {user?.email}
                        </Col>
                    </Row>
                </List.Item>
                <List.Item>
                    <Row
                        gutter={[2, 24]}
                        style={{
                            width: "100%",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
                        }}
                    >                            <Col span={8}>
                            Số điện thoại
                        </Col>
                        <Col span={16}>
                            {user?.phoneNumber}
                        </Col>
                    </Row>
                </List.Item>
            </List>
        </ProfileLayout>
    )
}