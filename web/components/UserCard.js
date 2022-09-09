import { BuildOutlined, EditOutlined, ExclamationCircleOutlined, HeartOutlined, ManOutlined, PlusOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Col, Divider, Row, Tag, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-toastify";
import axios from "../pages/api/axios";
import { UserContext } from "../providers/UserProvider";

const { Meta } = Card

const emotionStates = ['Độc thân', 'Crush', 'Thả thính', 'Hẹn hò', 'Kết hôn'];

export default function UserCard({ user }) {
    const { user: authUser } = useContext(UserContext)
    const router = useRouter()
    console.log("user", user);

    const handleEdit = () => {
        router.push('/profile/edit')
    }

    const handleAddFrient = () => {
        
    }

    const handleChat = async () => {
        if (authUser && user) {
            const res = await axios.post('chat/create-two', {
                ownerId: authUser.id,
                memberId: user.id,
            })
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })
            
            console.log("res", res);

            if (res.success) {
                router.push(`/chat/0/${res.data.id}`)
            } else {
                toast.error(res.message, {
                    position: "top-right",
                    autoClose: 1800,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        }
    }
    return (
        <>
            <Card
                cover={
                    user?.avatar ? (
                        <Badge
                            count={
                                user?.id === authUser?.id ?
                                    (
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(0, 0, 0, 0.25)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                border: "2px solid white",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleEdit}
                                        >
                                            <EditOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)"}} />
                                        </div>
                                    ) :
                                    (
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(0, 0, 0, 0.25)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                border: "2px solid white",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleEdit}
                                        >
                                            <PlusOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)"}} />
                                        </div>
                                    )}
                            offset={[-24, 108]}
                        >
                            <Avatar size={120} src={user.avatar} />
                        </Badge>
                    ) : (
                        <Badge
                            count={
                                user?.id === authUser?.id ?
                                    (
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(0, 0, 0, 0.25)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                border: "2px solid white",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleEdit}
                                        >
                                            <EditOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)"}} />
                                        </div>
                                    ) :
                                    (
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(0, 0, 0, 0.25)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                border: "2px solid white",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleAddFrient}
                                        >
                                            <PlusOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)"}} />
                                        </div>
                                    )}
                            offset={[-24, 108]}
                        >
                            <Avatar size={120} icon={<UserOutlined />} />    
                        </Badge>  
                    )
                }
                style={{
                    width: "264px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "32px",
                    borderRadius: "4px",
                }}
                bodyStyle={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 0,
                    paddingTop: "8px",
                    margin: 0,
                }}
            >
                <Typography.Title
                    level={3}
                >
                    {user?.fullname}
                </Typography.Title>
                <Typography.Text italic disabled>
                    {"@" + user?.username}
                </Typography.Text>
                <Divider style={{ width: "100%" }}>
                    {user && user.sex >= 0 && user.sex === 1 && (<WomanOutlined style={{ color: "pink", marginTop: "12px", }} />)}
                    {user && user.sex >= 0 && user.sex === 0 && (<ManOutlined style={{ color: "blue", marginTop: "12px", }} />)}
                </Divider>
                <Col
                    style={{
                        width: "100%",
                    }}
                    
                >
                    {user?.emotionState >= 0 && (
                        <Row gutter={[2, 24]}>
                            <Col span={6}>
                                <ExclamationCircleOutlined />
                            </Col>
                            {emotionStates[user?.emotionState]}
                        </Row>
                    )}
                    {user?.age && (
                        <Row  gutter={[2, 24]}>
                            <Col span={6}>
                                <HeartOutlined />
                            </Col>
                            {user?.age + " tuổi"}
                        </Row>
                    )}
                    {user?.characters.length > 0 && (
                        <Row  gutter={[2, 24]}>
                            <Col span={6}>
                                <BuildOutlined />
                            </Col>
                            <Col span={16}>
                                {user?.characters?.map(character => {
                                    return (
                                        <Tag key={character.id}>{character.name}</Tag>
                                    )
                                })}
                            </Col>
                        </Row>
                    )}
                </Col>
            </Card>
            <Button type="primary" style={{ width: "100%", marginTop: "16px" }} onClick={handleChat}>Nhắn tin với {user?.username}</Button>
        </>
    )
}