import { Col, Row } from "antd"
import { useContext, useEffect, useState } from "react"
import PostCard from "../../../components/PostCard"
import { ActionsContext } from "../../../providers/ActionsProvider"
import { UserContext } from "../../../providers/UserProvider"
import axios from "../../api/axios"

export default function PostsList({ userId }) {
    const { user: authUser } = useContext(UserContext)
    const { currentPost, setCurrentPost } = useContext(ActionsContext)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (authUser && userId) {
            const getPostsByOwner = async ({ ownerId, userId }) => {
                const res = await axios.get(`post/get-by-owner-id?ownerId=${ownerId}&userId=${userId}`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                setPosts(res.data)
            }
            getPostsByOwner({ ownerId: userId, userId: authUser.id })
        }
    }, [authUser, userId])

    useEffect(() => {
        if (currentPost && currentPost.state === "new") {
            setCurrentPost(null)
            const getPostsByOwner = async ({ ownerId, userId }) => {
                const res = await axios.get(`post/get-by-owner-id?ownerId=${ownerId}&userId=${userId}`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                setPosts(res.data)
            }
            getPostsByOwner({ ownerId: userId, userId: authUser?.id })
        }
    }, [currentPost, authUser, userId, setCurrentPost])

    return (
        <Col gutter={[2]} style={{ paddingBottom: "16px", width: "100%", }}>
            {
                posts?.map((post, index) => {
                    return (
                        <Row key={post.post.id} id={`post_${index}`}>
                            <PostCard data={post} />
                        </Row>
                    )
                })
            }
        </Col>
    )
}