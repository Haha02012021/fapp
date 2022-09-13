import { BuildOutlined, CheckOutlined, CloseOutlined, EditOutlined, ExclamationCircleOutlined, HeartOutlined, ManOutlined, PlusOutlined, SwapOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Col, Divider, Row, Tag, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../pages/api/axios";
import { UserContext } from "../providers/UserProvider";

const { Meta } = Card

const emotionStates = ['Độc thân', 'Crush', 'Thả thính', 'Hẹn hò', 'Kết hôn'];

export default function UserCard({ user }) {
    const { user: authUser } = useContext(UserContext)
    const router = useRouter()
    const [relationship, setRelationship] = useState()

    useEffect(() => {
        if (user && authUser) {
            const getRelationship = async (user, authUser) => {
                const res = await axios.get('user/get-relationship', {
                    params: {
                        userId: authUser.id,
                        friendId: user.id,
                    }
                })
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    setRelationship(res.data)
                } else {

                }
            }

            getRelationship(user, authUser)
        }
    }, [user, authUser])

    const handleEdit = () => {
        router.push('/profile/edit')
    }

    const handleAddFriend = async () => {
        if (user && authUser) {
            if (relationship.type === null || relationship.type === -2) {
                const res = await axios.post('user/add-friend', {
                    userId: authUser.id,
                    friendId: user.id,
                    type: -1,
                })
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                if (res.success) {
                    setRelationship({
                        userId: authUser.id,
                        type: -1,
                    })

                    const notiRes = await axios.post('notification/create', {
                        ownerId: authUser.id,
                        toId: user.id,
                        content: `${authUser.username} đã bình luận gửi lời mời kết bạn.`,
                        link: `/profile/friends/${user.id}`,
                    })
                        .then(res => res.data)
                        .catch(err => {
                            return {
                                success: false,
                                message: err.message,
                            }
                        })
                }
            } else if (relationship.type === -1) {
                if (relationship.userId === authUser.id) {
                    const res = await axios.delete('user/remove-friend', {
                        data: {
                            userId: authUser.id,
                            friendId: user.id,
                        }
                    })
                        .then(res => res.data)
                        .catch(err => {
                            return {
                                success: false,
                                message: err.message,
                            }
                        })
                    
                    if (res.success) {
                        setRelationship({
                            ...relationship,
                            type: null,
                        })

                        const notiRes = await axios.post('notification/remove', {
                            ownerId: authUser.id,
                            content: `${authUser.username} đã bình luận gửi lời mời kết bạn.`,
                            link: `/profile/friends/${user.id}`,
                        })
                            .then(res => res.data)
                            .catch(err => {
                                return {
                                    success: false,
                                    message: err.message,
                                }
                            })
    
                    } else {

                    }
                } else {
                    const res = await axios.post('user/add-friend', {
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
                        setRelationship({
                            ...relationship,
                            type: 0,
                        })
                    } else {
                        
                    }
                }
            } else {
                const res = await axios.delete('user/remove-friend', {
                    data: {
                        userId: authUser.id,
                        friendId: user.id,
                    }
                })
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    setRelationship({
                        ...relationship,
                        type: null,
                    })
                    const notiRes = await axios.post('notification/create', {
                        ownerId: authUser.id,
                        toId: user.id,
                        content: `${authUser.username} đã bỏ bạn bạn.`,
                        link: `/profile/friends/${user.id}`,
                    })
                        .then(res => res.data)
                        .catch(err => {
                            return {
                                success: false,
                                message: err.message,
                            }
                        })
                } else {

                }
            }
        }
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
                                            <Tooltip title="Chỉnh sửa">
                                                <EditOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)"}} />
                                            </Tooltip>
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
                                            onClick={handleAddFriend}
                                        >
                                            {
                                                relationship?.type === null ?
                                                    (
                                                        <Tooltip title="Kết bạn">
                                                            <PlusOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                        </Tooltip>
                                                    ) :
                                                    relationship?.type === -1 ?
                                                        relationship?.userId === authUser?.id ?
                                                            (
                                                                <Tooltip title="Bỏ kết bạn">
                                                                    <CloseOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                                </Tooltip>
                                                            ) :
                                                            (
                                                                <Tooltip title="Chấp nhận lời mời kết bạn">
                                                                    <SwapOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                                </Tooltip>
                                                            ) :
                                                        (
                                                            <Tooltip title="Bỏ bạn">
                                                                <CheckOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                            </Tooltip>
                                                        )
                                            }
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
                                            onClick={handleAddFriend}
                                        >
                                            {
                                                relationship?.type === null ?
                                                    (
                                                        <Tooltip title="Kết bạn">
                                                            <PlusOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                        </Tooltip>
                                                    ) :
                                                    relationship?.type === -1 ?
                                                        relationship?.userId === authUser?.id ?
                                                            (
                                                                <Tooltip title="Bỏ kết bạn">
                                                                    <CloseOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                                </Tooltip>
                                                            ) :
                                                            (
                                                                <Tooltip title="Chấp nhận lời mời kết bạn">
                                                                    <SwapOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                                </Tooltip>
                                                            ) :
                                                        (
                                                            <Tooltip title="Bỏ bạn">
                                                                <CheckOutlined style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }} />
                                                            </Tooltip>
                                                        )
                                            }
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
                    {user?.emotionState && user.emotionState >= 0 && (
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