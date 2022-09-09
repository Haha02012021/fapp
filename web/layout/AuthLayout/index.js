import { Avatar, Divider, Dropdown, Layout, Menu, message, Modal, Spin } from "antd";
import Head from "next/head";
import { memo, useContext, useEffect, useState } from "react";
import Logo from "../../components/Logo";
import { UserContext } from "../../providers/UserProvider";
import { useRouter } from "next/router";
import { LogoutOutlined, MessageOutlined, NotificationOutlined, ProfileOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { ActionsContext } from "../../providers/ActionsProvider";
import PostFormModal from "../../pages/profile/posts/PostFormModal";
import useSocket from "../../hooks/useSoket";
import { toast } from "react-toastify";
import axios from "../../pages/api/axios";

const { Header, Content, Sider, Footer } = Layout;

const menu = (handleLogout, handleProfile, handleChat, handleFriends, user, noti) => (
    <Menu
        items=
        {[
            {
                key: '1',
                label: (
                    <div
                        style={{
                            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                        }}
                        onClick={handleProfile}
                    >
                        <h3
                            style={{
                                fontSize: "20px",
                                margin: "0",
                                padding: "0"
                            }}
                        >
                            {user?.username}
                        </h3>
                        <p
                            style={{
                                fontStyle: "italic",
                            }}
                        >
                            <ProfileOutlined />
                            <span style={{ marginLeft: "4px" }}>{user?.email}</span>
                        </p>
                    </div>
                )
            },
            {
                key: '2',
                label: (
                    <div
                        onClick={handleChat}
                    >
                        <MessageOutlined />
                        <span style={{ marginLeft: "4px" }}>Tin nhắn</span>
                    </div>
                )
            },
            {
                key: '3',
                label: (
                    <div
                        onClick={handleFriends}
                    >
                        <TeamOutlined />
                        <span style={{ marginLeft: "4px" }}>Bạn bè {`(${noti.friendReqs})`}</span>
                    </div>
                )
            },
            {
                key: '4',
                label: (
                    <div
                        onClick={handleLogout}
                    >
                        <LogoutOutlined />
                        <span style={{ marginLeft: "4px" }}>Đăng xuất</span>
                    </div>
                ),
            },
        ]}
    />
)

function AuthLayout({ headTitle, children }) {
    const { user, setUser } = useContext(UserContext)
    const { isShowPostFormModal, setShowPostFormModal, setCurrentPost, isLoading, setOnlineUsers } = useContext(ActionsContext)
    const router = useRouter()
    const { socketRef } = useContext(ActionsContext)
    const [noti, setNoti] = useState({
        friendReqs: 0,
    })

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('users-change', onlineUsers => {
                console.log("users-change", onlineUsers);
                setOnlineUsers(onlineUsers)
            })
        }
    })

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'))

        console.log(currentUser);

        const now = new Date()

        if (currentUser && currentUser.expiry < now.valueOf()) {
            localStorage.removeItem('user');
            setUser(null)
            router.push('/login')
        }

        if (!user && currentUser) {
            const authUser = JSON.parse(Buffer.from(currentUser.token.split('.')[1], 'base64'));

            setUser(authUser);
        }

        if (!currentUser) {
            router.push('/login')
        }

        return () => {
            console.log("remove");
            message.destroy()
            // socketRef.current.disconnect()
        }
    }, [])

    useEffect(() => {
        if (user) {
            const getFriendReqNum = async (id) => {
                const res = await axios.get(`user/${id}/get-friend-req-number`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    setNoti({
                        friendReqs: res.data
                    })
                } else {
    
                }
            }
    
            getFriendReqNum(user.id)
        }
    }, [user])

    useEffect(() => {
        console.log("socketRef", socketRef);
        
        if (socketRef.current && user) {
            socketRef.current.connect()
            console.log("user-online");
            socketRef.current.emit('user-online', user)

            socketRef.current.on('new-message', newMsg => {
                console.log('new-msg', newMsg);
                message.info({
                    duration: "2",
                    content: (
                        <div><NotificationOutlined /><b>{newMsg.owner.username}</b> đã gửi tin nhắn cho bạn!</div>
                    ),
                    onClose: () => {
                        message.destroy()
                    },
                    onClick: () => {
                        message.destroy()
                        router.push(`/chat/0/${newMsg.to.ChatsUsers.chatId}`)
                    }
                })
            })
        }
    }, [socketRef.current])

    const handleProfile = () => {
        return router.push(`/profile/detail/${user.id}`)
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null)
        socketRef.current.emit('user-off', user)
        return router.push('/login')
    }

    const handleChat = () => {
        router.push('/chat')
    }

    const handleFriends = () => {
        router.push(`/profile/friends/${user.id}`)
    }

    return (
        <Layout>
            <Head>DApp - {headTitle}</Head>
            <Header
                theme="light"
                style={{
                    color: "white",
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                }}
            >
                <Logo />
                <Dropdown overlay={() => menu(handleLogout, handleProfile, handleChat, handleFriends, user, noti)} arrow style={{ right: "80px", left: "auto", position: "absolute" }}>
                    <a
                        style={{
                            textDecoration: "none",
                            color: "white",
                            float: "right",
                        }}
                        onClick={e => e.preventDefault()}
                    >
                        <div style={{ height: "64px", display: "flex", alignItems: "center" }}>
                            <Avatar size={32} icon={<UserOutlined />} src={user?.avatar} style={{ float: "right" }} />
                        </div>
                    </a>
                </Dropdown>
            </Header>
            <Spin spinning={isLoading} size="large" style={{ zIndex: 1200, }}>
                {children}
                <Modal
                    visible={isShowPostFormModal}
                    footer={null}
                    onCancel={() => {
                        setShowPostFormModal(false)
                        setCurrentPost(null)
                    }}
                    bodyStyle={{
                        minHeight: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                    className="up-post"
                >
                    <PostFormModal />
                </Modal>
            </Spin>
        </Layout>
    )
}

export default memo(AuthLayout)