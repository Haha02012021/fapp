import { NotificationOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import PostCard from "../../components/PostCard";
import useSocket from "../../hooks/useSoket";
import AuthLayout from "../../layout/AuthLayout/index";
import { ActionsContext } from "../../providers/ActionsProvider";
import { UserContext } from "../../providers/UserProvider";
import axios from "../api/axios";
import CaredTop from "./CaredTop";

export default function Home() {
    const { user } = useContext(UserContext)
    const router = useRouter()
    const [allPosts, setAllPosts] = useState([])

    useEffect(() => {
        if (user) {
            const getAllPosts = async () => {
                const res = await axios.get('post/get-all', {
                    params: {
                        userId: user.id,
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
                    setAllPosts(res.data)
                } else {

                }
            }

            getAllPosts()
        }
    }, [user])

    const handleRemoveUsers = () => {
        if (socketRef.current) {
            socketRef.current.emit('remove-users')
        }
    }

    return (
        <>
            <AuthLayout headTitle={"Home"}>
                <Row gutter={[24]}>
                    <Col span={6}></Col>
                    <Col span={10} style={{ marginTop: "84px", }}>
                        {allPosts?.map(post => {
                            return <PostCard key={post.id} data={post} />
                        })}
                    </Col>
                    <Col>
                        <CaredTop />
                    </Col>
                </Row>
            </AuthLayout>
        </>
    )
}