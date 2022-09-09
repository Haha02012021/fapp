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

const { Option } = Select

export default function ChatBox() {
    const router = useRouter()
    const { type, id: roomId } = router.query
    const { user } = useContext(UserContext)
    const [others, setOthers] = useState()
    const [messages, setMessages] = useState([])
    const { socketRef, socketCreated, onlineUsers, setOnlineUsers } = useContext(ActionsContext)
    const [form] = Form.useForm()

    useEffect(() => {
        if (socketRef.current && socketRef.current.connected) {
            socketCreated.current = false
        }

        if (!socketCreated.current) {
            if (socketRef.current && !socketRef.current.connected) {
                console.log("reconnect");
                socketRef.current.once('connect')
                socketCreated.current = true
            }
        }
    }, [socketRef.current])

    useEffect(() => {
        const getChat = async (id) => {
            const res = await axios.get(`chat/get/${id}`)
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })
            console.log(res);
            if (res.success) {
                setMessages(res.data.messages)
                setOthers(res.data.chat?.members.filter(member => member.id !== user?.id))
            }
        }

        getChat(roomId)

        console.log("socketRef", socketRef);

        if (socketRef.current && socketRef.current.connected && roomId) {
            console.log("join");
            socketRef.current.emit('join', roomId)

            socketRef.current.on('update-message', newMsg => {
                console.log(newMsg);
                setMessages(prev => [...prev, newMsg])
            })

            return () => {
                socketRef.current.emit('leave', roomId)
            }   
        }
    }, [roomId, socketRef.current])

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

            console.log("msgReq", req);

            const res = await axios.post('message/create', req)
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })
            
            if (res.success) {
                console.log("msgRes", res);
                form.setFieldValue('message', '')
                if (others) {
                    others.map(member => {
                        if (value && others) {
                            const newMsg = {
                                owner: {
                                    id: user.id,
                                    avatar: user.avatar,
                                    username: user.username,
                                },
                                to: member,
                                content: value.message,
                            }
                            setMessages(prev => [...prev, newMsg])
                
                            socketRef.current.emit('message-change', roomId, newMsg)
                        }
                    })
                }
            }
        }
    }

    console.log("online", onlineUsers);
      
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
                                    <Form>
                                        <Form.Item
                                            label="Tên nhóm"
                                        >
                                            <Input placeholder="Nhập tên nhóm" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Thêm thành viên"
                                        >
                                            
                                        </Form.Item>
                                    </Form>
                                </>) :
                                (
                                    <>
                                        <div style={{ height: "64px" }}>
                                            {type == 0 ?
                                                (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <Avatar src={others && others[0]?.avatar} size={40} />
                                                        <div style={{ paddingLeft: "4px" }}>
                                                            <b>{others && others[0].username}</b>
                                                            <p style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.2)" }}>
                                                                <i>
                                                                    {others && onlineUsers?.findIndex(onlineUser => onlineUser.user.id === others[0]?.id) >= 0 ? 
                                                                        "Active now" :
                                                                    "Offline"}
                                                                </i>
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) :
                                                (
                                                    <></>
                                            )}
                                            <Divider style={{ padding: 0, margin: 0, marginTop: "8px", }} />
                                        </div>
                                        <div style={{ maxHeight: "56vh", overflowY: "auto", minHeight: "472px", marginTop: "2px", marginBottom: "2px" }} className={styles.messages_list}>
                                            {messages?.map((message, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={
                                                            message.owner.id === user?.id ? styles.owner_bubble : styles.other_bubble
                                                        }
                                                    >
                                                        <Avatar src={message.owner.avatar} icon={<UserOutlined />} />
                                                        <span className={styles.bubble}>{message.content}</span>
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
        </AuthLayout>
    )
}