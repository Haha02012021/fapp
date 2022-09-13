import { ContactsOutlined, FileDoneOutlined, IdcardOutlined, TeamOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "../../../pages/api/axios";

const items = [
    {
        label: "Thông tin",
        key: "detail",
        icon: <IdcardOutlined />,
    },
    {
        label: "Bài đăng",
        key: "posts",
        icon: <FileDoneOutlined />,
    },
    {
        label: "Bạn bè",
        key: "friends",
        icon: <TeamOutlined />,
    },
]

export default function ProfileMenu({ userId }) {
    const router = useRouter()

    const handleItem = (e) => {
        if (userId) {
            return router.push(`/profile/${e.key}/${userId}`)
        }
    }

    return (
        <Menu
            mode="horizontal"
            style={{
                display: "flex",
                justifyContent: "center",
                position: "sticky",
                top: 64,
                zIndex: 10,
            }}
            selectedKeys={[router.asPath.split("/")[2]]}
            onClick={handleItem}
            items={items}
        />
    )
}