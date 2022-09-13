import { DeleteOutlined, EllipsisOutlined, ExclamationCircleOutlined, EyeOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Dropdown, Menu, Modal, Row, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-toastify";
import axios from "../pages/api/axios";
import { UserContext } from "../providers/UserProvider";
import styles from "../styles/FriendCard.module.css";

const moreActions = [
    {
        key: '0',
        label: (
            <Space>
                <EyeOutlined />
                Xem
            </Space>
        ),
        path: '/profile/detail/',
    },
    {
        key: '1',
        label: (
            <Space>
                <MessageOutlined />
                Nhắn tin
            </Space>
        ),
        path: '/chat/0/',
    },
    {
        key: '2',
        label: (
            <Space>
                <DeleteOutlined />
                Bỏ bạn
            </Space>
        ),
        path: null,
    },
]

export default function FriendCard({ user, friend, handleDelete }) {
    const router = useRouter()
    const { user: authUser } = useContext(UserContext)

    const handleAction = (op) => {
        const action = moreActions[op.key]

        if (action.path) {
            if (action.path.includes('chat')) {
                if (authUser) {
                    const getChat = async () => {
                        const res = await axios.post('chat/create-two', {
                            ownerId: authUser.id,
                            memberId: friend.id,
                        })
                            .then(res => res.data)
                            .catch(err => {
                                return {
                                    success: false,
                                    message: err.message,
                                }
                            })            
                        if (res.success) {
                            router.push(action.path + res.data.id)
                        } else { 
                            
                        }
                    }
    
                    getChat()
                }
            }
            router.push(action.path + friend.id)
        } else {
            Modal.confirm({
                title: 'Bạn sẽ không thể nhận thông báo từ người này nữa!',
                icon: <ExclamationCircleOutlined />,
                content: 'Bạn có chắc muốn bỏ bạn không?',
                okText: 'OK',
                cancelText: 'Cancel',
                onOk: async () => {
                    if (friend && authUser) {
                        const res = await axios.delete(`user/remove-friend`, {
                            data: {
                                userId: authUser.id,
                                friendId: friend.id,
                            },
                        })
                            .then(res => res.data)
                            .catch(err => {
                                return {
                                    success: false,
                                    message: err.message,
                                }
                            })
                        
                        if (res.success) {
                            toast.success('Bỏ bạn thành công!', {
                                position: "top-right",
                                autoClose: 1800,
                                hideProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            setTimeout(() => {
                                handleDelete(friend.id)
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
                }
            });
        }
    }

    return (
        <Row
            gutter={[2, 24]}
            style={{
                minWidth: "400px",
                padding: "8px",
                backgroundColor: "white",
                borderRadius: "4px",
            }}
        >
            <Col
                span={20}
                style={{
                    display: "flex",
                }}
            >
                <Col>
                    <Avatar src={friend?.avatar} icon={<UserOutlined />} shape="square" size={48} />
                </Col>
                <Col style={{ paddingLeft: "4px", }}>
                    <Row>
                        <b>{friend?.fullname}</b>
                    </Row>
                    <Row>
                        <Typography.Text disabled italic>@{friend?.username}</Typography.Text>
                    </Row>
                </Col>
            </Col>
            <Col
                span={4}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                {user?.id === authUser?.id && (
                    <Dropdown
                        arrow
                        placement="bottom"
                        overlay={(
                            <Menu
                                onClick={handleAction}
                                items={moreActions}
                            />
                        )}
                    >
                        <EllipsisOutlined className={styles.action} />
                    </Dropdown>
                )}
            </Col>
        </Row>
    )
}