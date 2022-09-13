import { HeartOutlined, InfoCircleOutlined, ManOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Col, Row, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-toastify";
import { emotionStates } from "../constant/emotionStates";
import axios from "../pages/api/axios";
import { UserContext } from "../providers/UserProvider";

export default function ReqFriendCard({ user, handleAcceptUser, handleRefuseUser }) {
    const { user: authUser } = useContext(UserContext)
    const router = useRouter()
    const handleAccept = () => {
        if (user && authUser) {
            const acceptUser = async (user, authUser) => {
                const res = await axios.post(`user/add-friend`, {
                    userId: user.id,
                    friendId: authUser.id,
                    type: 0,
                })
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })

                if (res.success) {
                    toast.success(`Bạn và ${user.username} đã trở thành bạn của nhau!`, {
                        position: "top-right",
                        autoClose: 1800,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setTimeout(() => {
                        handleAcceptUser(user)
                    }, 2000)
                } else {
                    toast.error(res.message, {
                        position: "top-right",
                        autoClose: 1800,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }

            acceptUser(user, authUser)
        }
    }

    const handleRefuse = async () => {
        const res = await axios.post('user/add-friend', {
            userId: user.id,
            friendId: authUser.id,
            type: -2,
        })
            .then(res => res.data)
            .catch(err => {
                return {
                    success: false,
                    message: err.message,
                }
            })
        
        if (res.success) {
            handleRefuseUser(user)
        } else {
            
        }
    }

    return (
        <Card
            style={{
                maxWidth: "180px",
            }}
        >
            <>
                <Row gutter={[2, 24]}>
                    <Col
                        span={12}
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Badge
                            count={(
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: user?.sex === 0 ? "blue" : "pink",
                                        width: "16px",
                                        height: "16px",
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {user?.sex === 0 ? 
                                        <ManOutlined /> :
                                        user?.sex === 1 ?
                                            <WomanOutlined /> :
                                            null}
                                </div>
                            )}
                            offset={[-8, 8]}
                        >
                            <Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
                        </Badge>
                    </Col>
                    <Col span={12}>
                        <Row>
                            <b
                                onClick={() => {
                                    if (user) router.push(`/profile/detail/${user?.id}`)
                                }}
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                {user?.fullname}
                            </b>
                        </Row>
                        <Row style={{ fontSize: "10px", }}>
                            <Typography.Text italic disabled>
                                {"@" + user?.username}
                            </Typography.Text>
                        </Row>
                        <Row style={{ fontSize: "10px", }}>
                            <Col style={{ paddingRight: "2px", }}>
                                <InfoCircleOutlined />
                            </Col>
                            <Col>
                                {emotionStates[user?.emotionState]}
                            </Col>
                        </Row>
                        <Row style={{ fontSize: "10px", }}>
                            <Col style={{ paddingRight: "2px" }}>
                                <HeartOutlined />
                            </Col>
                            <Col>
                                {user?.age} tuổi
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Space
                    style={{
                        paddingTop: "20px",
                    }}
                >
                    <Button type="primary" size="small" onClick={handleAccept}>Đồng ý</Button>
                    <Button size="small" onClick={handleRefuse}>Từ chối</Button>
                </Space>
            </>
        </Card>
    )
}