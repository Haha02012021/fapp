import { Avatar, Badge, Divider, Dropdown, Layout, List, Menu, message, Modal, Spin } from "antd";
import Head from "next/head";
import { memo, useContext, useEffect, useState } from "react";
import Logo from "../../components/Logo";
import { UserContext } from "../../providers/UserProvider";
import { useRouter } from "next/router";
import {
    LogoutOutlined,
    MessageOutlined,
    NotificationOutlined,
    ProfileOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { ActionsContext } from "../../providers/ActionsProvider";
import PostFormModal from "../../pages/profile/posts/PostFormModal";
import axios from "../../pages/api/axios";
import NotiModal from "../../components/NotiModal";

const { Header, Content, Sider, Footer } = Layout;

const menu = (handleLogout, handleProfile, handleChat, handleFriends, user, noti, setShowNotiModal) => (
    <Menu
        items={[
            {
                key: "1",
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
                                padding: "0",
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
                ),
            },
            {
                key: "2",
                label: (
                    <div onClick={handleChat}>
                        <MessageOutlined />
                        <span style={{ marginLeft: "4px" }}>Tin nhắn</span>
                    </div>
                ),
            },
            {
                key: "3",
                label: (
                    <div onClick={handleFriends}>
                        <TeamOutlined />
                        <span style={{ marginLeft: "4px" }}>Bạn bè {noti?.friendReqs > 0 && `(${noti?.friendReqs})`}</span>
                    </div>
                ),
            },
            {
                key: "4",
                label: (
                    <div onClick={() => setShowNotiModal(true)}>
                        <NotificationOutlined />
                        <span
                            style={{ marginLeft: "4px" }}
                        >
                            Thông báo
                            {noti.others?.filter(other => other.state === 0).length > 0 && `(${noti.others?.filter(other => other.state === 0).length})`}
                        </span>
                    </div>
                ),
            },
            {
                key: "5",
                label: (
                    <div onClick={handleLogout}>
                        <LogoutOutlined />
                        <span style={{ marginLeft: "4px" }}>Đăng xuất</span>
                    </div>
                ),
            },
        ]}
    />
);

function AuthLayout({ headTitle, children }) {
    const { user, setUser } = useContext(UserContext);
    const {
        isShowPostFormModal,
        setShowPostFormModal,
        isShowNotiModal,
        setShowNotiModal,
        setCurrentPost,
        isLoading,
        setOnlineUsers
    } = useContext(ActionsContext);
    const router = useRouter();
    const { noti, setNoti, socketRef } = useContext(ActionsContext);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        const now = new Date();

        if (currentUser && currentUser.expiry < now.valueOf()) {
            localStorage.removeItem("user");
            setUser(null);
            router.push("/login");
        }

        if (!user && currentUser) {
            const authUser = JSON.parse(Buffer.from(currentUser.token.split(".")[1], "base64"));

            setUser(authUser);
        }

        if (!currentUser) {
            router.push("/login");
        }

        return () => {
            message.destroy();
        };
    }, []);

    useEffect(() => {
        if (user) {
            const getFriendReqNum = async (id) => {
                const res = await axios
                    .get(`user/${id}/get-friend-req-number`)
                    .then((res) => res.data)
                    .catch((err) => {
                        return {
                            success: false,
                            message: err.message,
                        };
                    });

                if (res.success) {
                    setNoti({
                        friendReqs: res.data,
                    });
                } else {
                }
            };

            getFriendReqNum(user.id);

            const getNotis = async () => {
                const res = await axios.get(`notification/get-by-user-id/${user.id}`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                                
                if (res.success) {
                    setNoti(prev => {
                        return {
                            ...prev,
                            others: res.data,
                        }
                    })
                }
            }

            getNotis()
        }
    }, [user]);

    useEffect(() => {
        if (socketRef.current && user) {
            socketRef.current.connect();

            socketRef.current.on("new-message", (roomId, newMsg) => {
                message.info({
                    duration: "2",
                    content: (
                        <div>
                            <NotificationOutlined />
                            <b>{newMsg.owner.username}</b> đã gửi tin nhắn cho bạn!
                        </div>
                    ),
                    onClose: () => {
                        message.destroy();
                    },
                    onClick: () => {
                        message.destroy();
                        router.push(`/chat/${roomId}`);
                    },
                });
            }); 

            socketRef.current.on("users-change", (onlineUsers) => {
                setOnlineUsers(onlineUsers);
            });

            return () => {
                socketRef.current.off('new-message')
            }
        }
    }, [socketRef.current, router]);

    const handleProfile = () => {
        return router.push(`/profile/detail/${user.id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        socketRef.current.emit("user-off", user);
        return router.push("/login");
    };

    const handleChat = () => {
        router.push("/chat");
    };

    const handleFriends = () => {
        router.push(`/profile/friends/${user.id}`);
    };

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
                <Dropdown
                    overlay={() => menu(handleLogout, handleProfile, handleChat, handleFriends, user, noti, setShowNotiModal)}
                    arrow
                    style={{ right: "80px", left: "auto", position: "absolute" }}
                >
                    <a
                        style={{
                            textDecoration: "none",
                            color: "white",
                            float: "right",
                        }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <div style={{ height: "64px", display: "flex", alignItems: "center" }}>
                            <Badge
                                count={noti.others?.filter(other => other.state === 0).length}
                            >
                                <Avatar size={32} icon={<UserOutlined />} src={user?.avatar} style={{ float: "right" }} />
                            </Badge>
                        </div>
                    </a>
                </Dropdown>
            </Header>
            <Spin spinning={isLoading} size="large" style={{ zIndex: 1200 }}>
                {children}
                <Modal
                    visible={isShowPostFormModal}
                    footer={null}
                    onCancel={() => {
                        setShowPostFormModal(false);
                        setCurrentPost(null);
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
                <Modal
                    visible={isShowNotiModal}
                    onCancel={() => {
                        setShowNotiModal(false)
                    }}
                    title="Thông báo"
                    footer={null}
                >
                    <NotiModal notis={noti.others} />
                </Modal>
            </Spin>
        </Layout>
    );
}

export default memo(AuthLayout);
