import { NotificationOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import useSocket from "../../hooks/useSoket";
import AuthLayout from "../../layout/AuthLayout/index";
import { ActionsContext } from "../../providers/ActionsProvider";
import { UserContext } from "../../providers/UserProvider";

export default function Home() {
    const { user } = useContext(UserContext)
    const { socketRef } = useContext(ActionsContext)
    const router = useRouter()

    const handleRemoveUsers = () => {
        if (socketRef.current) {
            socketRef.current.emit('remove-users')
        }
    }

    return (
        <>
            <AuthLayout headTitle={"Home"}>
                <Button type="danger" onClick={handleRemoveUsers}>Remove all Users</Button>
            </AuthLayout>
        </>
    )
}