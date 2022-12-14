import { GroupOutlined, PlusCircleOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Menu, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "../api/axios";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

export default function ChatBoxSideBar({ userId, index = false }) {
    const [groupChats, setGroupChats] = useState([])
    const [personalChats, setPersonalChats] = useState([])
    const router = useRouter()
    const [defaultMenu, setDefaultMenu] = useState({
        type: '',
        id: '',
    })

    useEffect(() => {
        const { type, id } = router.query

        if (type && id) {
            setDefaultMenu({
                type: type.toString(),
                id: id.toString(),
            })
        }
    }, [router])

    useEffect(() => {
        const getChats = async (userId, type) => {
            const res = await axios.get('chat/get', {
                params: {
                    id: userId,
                    type,
                }
            })
                .then(res => res.data)

            if (res.success) {
                if (type == 0) {
                    setPersonalChats(res.data)
                } else if (type == 1) {
                    setGroupChats(res.data)
                }
            }
        }

        getChats(userId, 0)
        getChats(userId, 1)
    }, [userId])

    const handleChatOption = (op) => {
        router.push(`/chat/${op.keyPath[1]}/${op.keyPath[0]}`)
    }

    return (
        <>
            <div style={{ height: "64px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "center", }}>
                    <Typography.Title level={4}>DChat</Typography.Title>
                </div>
                <Divider style={{ margin: 0 }} />
            </div>
            {!index && defaultMenu.type && defaultMenu.id && (
                <Menu
                    onClick={handleChatOption}
                    style={{ width: "100%" }}
                    defaultSelectedKeys={[defaultMenu.id]}
                    defaultOpenKeys={() => {
                        return [defaultMenu.type]
                    }}
                    mode="inline"
                    items={[
                        getItem('Nh??m', '1', <GroupOutlined />, [
                            getItem('Th??m nh??m', 'add', <PlusCircleOutlined />),
                            ...groupChats?.map(chat => {
                                return getItem((
                                    <>
                                        <Avatar src={chat.avatar} icon={<TeamOutlined />} />
                                        {chat.name}
                                    </>
                                ), chat.id?.toString())
                            })
                        ]),

                        getItem('C?? nh??n', '0', <UserOutlined />,
                            personalChats && personalChats?.map(chat => {
                                const other = chat?.members?.find(member => member.id !== userId)

                                return getItem((
                                    <>
                                        <Avatar src={other?.avatar} icon={<UserOutlined />} />
                                        {other?.username}
                                    </>
                                ), chat?.id?.toString())
                            })
                        ),
                    ]}
                />
            )}
            {index && (
                <Menu
                    onClick={handleChatOption}
                    style={{ width: "100%" }}
                    defaultOpenKeys={['0', '1']}
                    mode="inline"
                    items={[                      
                        getItem('C?? nh??n', '0', <UserOutlined />,
                            personalChats?.map(chat => {
                                const other = chat?.members?.find(member => member.id !== userId)

                                return getItem((
                                    <>
                                        <Avatar src={other?.avatar} icon={<UserOutlined />} />
                                        {other?.username}
                                    </>
                                ), chat?.id?.toString())
                            })
                        ),
                        getItem('Nh??m', '1', <GroupOutlined />, [
                            getItem('Th??m nh??m', 'add', <PlusCircleOutlined />),
                            ...groupChats?.map(chat => {
                                if (chat) {
                                    return getItem((
                                        <>
                                            <Avatar src={chat.avatar} icon={<UserOutlined />} />
                                            {chat.name}
                                        </>
                                    ), chat.id?.toString())
                                }
                            })
                        ]),
                    ]}
                />
            )}
        </>
    )
}