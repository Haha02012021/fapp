import { SendOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Divider, Form, Input, Row, Select } from "antd"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import AuthLayout from "../../../layout/AuthLayout"
import { ActionsContext } from "../../../providers/ActionsProvider"
import { UserContext } from "../../../providers/UserProvider"
import axios from "../../api/axios"
import styles from "../../../styles/ChatBox.module.css"
import ChatBoxSideBar from "../ChatBoxSidebar"
import CreateGroupForm from "./CreateGroupForm"

export default function ChatBox() {
    const router = useRouter()
    const [isMember, setMember] = useState(false)
    const { type, id: roomId } = router.query
    const { user } = useContext(UserContext)
    const [others, setOthers] = useState()
    const [messages, setMessages] = useState([])
    const { socketRef, onlineUsers } = useContext(ActionsContext)
    const [chat, setChat] = useState({
        name: '',
        avatar: '',
        isOnline: false,
    })
    const [form] = Form.useForm()

    useEffect(() => {
        if (onlineUsers && others) {
            for (const member of others) {
                const findOnlineUserIndex = onlineUsers.findIndex(onlineUser => onlineUser.userId === member.id)

                if (findOnlineUserIndex >= 0) {
                    setChat(prev => {
                        return {
                            ...prev,
                            isOnline: true,
                        }
                    })
                    break
                }
            }
        }
    }, [onlineUsers, others])

    useEffect(() => {
        if (roomId && type && type != "add") {
            const getChat = async (id) => {
                const res = await axios.get(`chat/get/${id}`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                if (res.success) {
                    setMessages(res.data.messages)
                    const authIndex = res.data.chat?.members.findIndex(member => member.id === user?.id)
                    if (authIndex >= 0 || roomId === "add") setMember(true)
                    const others = res.data.chat?.members.filter(member => member.id !== user?.id)
                    setOthers(others)
                    if (type == 0) {
                        setChat({
                            name: others[0].username,
                            avatar: others[0].avatar,
                        })
                    } else if (type == 1) {
                        setChat({
                            name: res.data.chat?.name,
                            avatar: res.data.chat?.avatar,
                        })
                    }
                }
            }
    
            getChat(roomId)
        }
    }, [roomId, type, user])

    useEffect(() => {
        if (isMember && socketRef.current?.connected && type && roomId && others) {
            socketRef.current.emit('join', `${type}/${roomId}`, user)

            socketRef.current.on('update-message', newMsg => {
                setMessages(prev => [...prev, newMsg])
            })

            return () => {
                socketRef.current.emit('leave', `${type}/${roomId}`, user)
                socketRef.current.off('update-message')
            }   
        }
    }, [roomId, socketRef, type, roomId, others, isMember, user])

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const handleSend = async (value) => {
        if (value) {
            const req = {
                ownerId: user.id,
                type: 0,
                content: value.message,
                chatId: new Number(roomId),

            }
            const res = await axios.post('message/create', req)
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })
            
            if (res.success) {
                form.setFieldValue('message', '')
                if (others) {
                    let newMsg = {
                        owner: {
                            id: user.id,
                            avatar: user.avatar,
                            username: user.username,
                        },
                        content: value.message,
                    }
                    setMessages(prev => [...prev, newMsg])
                    socketRef.current.emit('message-change', `${type}/${roomId}`, newMsg)
                }
            }
        }
    }
      
    return (
        <AuthLayout>
            {isMember ? (
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
                            <ChatBoxSideBar userId={user?.id} />
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
                            }}>
                            {
                                roomId === "add" ?
                                    (<>
                                        <CreateGroupForm />
                                    </>) :
                                    (
                                        <>
                                            <div style={{ height: "64px" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                    }}
                                                >
                                                    <Avatar src={chat?.avatar} size={40} />
                                                    <div style={{ paddingLeft: "4px" }}>
                                                        <b>{chat?.name}</b>
                                                        <p style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.2)" }}>
                                                            <i>
                                                                {chat.isOnline ? 
                                                                    "Active now" :
                                                                "Offline"}
                                                            </i>
                                                        </p>
                                                    </div>
                                                </div>
                                                <Divider style={{ padding: 0, margin: 0, marginTop: "8px", }} />
                                            </div>
                                            <div style={{ maxHeight: "56vh", overflowY: "auto", minHeight: "472px", marginTop: "2px", marginBottom: "2px" }} className={styles.messages_list}>
                                                {messages?.map((message, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={
                                                                message?.owner?.id === user?.id ? styles.owner_bubble : styles.other_bubble
                                                            }
                                                        >
                                                            <Avatar src={message?.owner?.avatar} icon={<UserOutlined />} />
                                                            <span className={styles.bubble}>{message?.content}</span>
                                                        </div>
                                                    )
                                                })}
                                                <div ref={messagesEndRef} />
                                            </div>
                                            <div style={{ height: "fit-content", display: "flex", alignItems: "flex-end" }}>
                                                <div style={{ display: "flex", width: "100%", }}>
                                                    <Avatar src={user?.avatar} icon={<UserOutlined />} />
                                                    <Form
                                                        style={{ display: "flex", width: "100%" }}
                                                        onFinish={handleSend}
                                                        form={form}
                                                    >
                                                        <Form.Item
                                                            name="message"
                                                            style={{
                                                                width: "100%",
                                                                paddingLeft: "8px",
                                                                paddingRight: "8px",
                                                                margin: 0,
                                                            }}
                                                        >
                                                            <Input placeholder="Nhập tin nhắn" />
                                                        </Form.Item>
                                                        <Button type="primary" htmlType="submit">
                                                            <SendOutlined />
                                                        </Button>
                                                    </Form>
                                                </div>
                                            </div>
                                        </>
                                    )
                            }
                        </Col>
                    </Row>
                </div>
            ) : (
                    <div
                        style={{
                            minHeight: "calc(100vh - 64px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(0, 0, 0, 0.65)"                            
                        }}
                    >
                        401 | Bạn không có quyền vào trang này!
                    </div>
            )}
        </AuthLayout>
    )
}