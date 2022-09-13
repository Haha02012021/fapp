import { CommentOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, ExclamationCircleOutlined, LikeOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Carousel, Col, Divider, Dropdown, Form, Image, Input, Menu, Popover, Row, Space } from "antd";
import { convertFromHTML } from "draft-convert";
import { Editor, EditorState } from "draft-js";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { reactIcons } from "../constant/reactIcons";
import { statusIcons } from "../constant/statusIcons";
import axios from "../pages/api/axios";
import { ActionsContext } from "../providers/ActionsProvider";
import CommentProvider, { CommentContext } from "../providers/CommentProvider";
import { UserContext } from "../providers/UserProvider";
import styles from "../styles/PostCard.module.css";
import CustomComment from "./CustomComment";

const moreActions = [
    {
        key: '0',
        label: (
            <Space>
                <EditOutlined />
                Sửa
            </Space>
        ),
    },
    {
        key: '1',
        label: (
            <Space>
                <DeleteOutlined />
                Xóa
            </Space>
        ),
    },
]

export default function PostDetailModal({ data }) {
    const { user } = useContext(UserContext)
    const { setNoti } = useContext(ActionsContext)
    const [content, setContent] = useState(() => EditorState.createEmpty())
    const [post, setPost] = useState()
    const [react, setReact] = useState()
    const { comments, setComments, newComment, setNewComment } = useContext(CommentContext)
    const [form] = Form.useForm()
    const router = useRouter()

    const commentInputRef = useRef()

    useEffect(() => {
        const htmlContent = data.post.content
        setContent(prev => EditorState.push(prev, convertFromHTML(htmlContent)))

        const localTime = new Date(data.post.updatedAt)
        const localTimeStr = localTime.toLocaleString()

        setPost({
            ...data.post,
            updatedAt: localTimeStr,
        })
        setReact(data.react)

        if (data) {
            const getAllComments = async () => {
                const comments = await axios.get(`comment/get-by-post-id/${data.post.id}`)
                    .then(res => res.data)
                    .catch(err => {

                    })
                
                if (comments) {
                    setComments(comments)
                } else {

                }
            }

            getAllComments()
        }
    }, [data, setComments]) 

    useEffect(() => {
        form.setFieldValue('comment', newComment.content)
    }, [newComment, form])

    const handleAction = (e) => {
        const key = e.key
        switch (key) {
            case "0":
                setCurrentPost({
                    ...data.post,
                    state: "exist",
                })
                setShowPostFormModal(true)
                break;
            case "1":
                Modal.confirm({
                    title: 'Bạn sẽ không thể xem được bài viết này nữa!',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Bạn có chắc muốn xóa bỏ không?',
                    okText: 'OK',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        if (post) {
                            const res = await axios.delete(`post/${post.id}/delete`)
                                .then(res => res.data)
                                .catch(err => {
                                    return {
                                        success: false,
                                        message: err.message,
                                    }
                                })
                            
                            if (res.success) {
                                toast.success('Xóa bài viết thành công!', {
                                    position: "top-right",
                                    autoClose: 1800,
                                    hideProgressBar: false,
                                    closeOnClick: false,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                                setCurrentPost({
                                    state: "new",
                                })
                                setShowPostFormModal(false)
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
                break;
            default:
                break;
        }
    }

    const handleReact = async (reactIconId) => {
        if (react.reactType === null) {
            const res = await axios.post('postsusers/create', {
                userId: user.id,
                postId: post.id,
                reactType: reactIconId,
            })
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })            
            if (res.success) {
                setReact({
                    reactType: reactIconId,
                    reactAmount: react.reactAmount + 1
                })

                const notiRes = await axios.post('notification/create', {
                    ownerId: user.id,
                    toId: post.ownerId,
                    content: `${user.username} đã bày tỏ cảm xúc về bài viết của bạn.`,
                    link: router.asPath + `#post_${post.id}`,
                })
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
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
        } else {
            const res = await axios.put('postsusers/update', {
                userId: user.id,
                postId: post.id,
                reactType: reactIconId,
            })
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })

            if (res.success) {
                setReact({
                    ...react,
                    reactType: reactIconId,
                })
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

    const handleComment = () => {
        commentInputRef.current.focus()
    }

    const handleSendComment = async () => {
        if (content && data && user) {
            if (newComment.state === 'edit') {
                const {id, ...data} = newComment
                const res = await axios.put(`comment/edit/${newComment.id}`, data)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    form.setFieldValue('comment', '')
                    setNewComment({
                        content: '',
                    })
                    setComments(res.data)
                } else {

                }
            } else {
                const newCmt = {
                    ...newComment,
                    postId: data.post.id,
                    ownerId: user.id,
                }
                const res = await axios.post('comment/create', newCmt)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                if (res.success) {
                    form.setFieldValue('comment', '')
                    setNewComment({
                        content: '',
                    })
                    setComments(res.data)

                    const notiRes = await axios.post('notification/create', {
                        ownerId: user.id,
                        toId: post.ownerId,
                        content: `${user.username} đã bình luận bài viết của bạn.`,
                        link: router.asPath + `#post_${post.id}`,
                    })
                        .then(res => res.data)
                        .catch(err => {
                            return {
                                success: false,
                                message: err.message,
                            }
                        })                   
                } else {
    
                }
            }
        }
    }

    return (
        <Row gutter={[24]} style={{ width: "100%" }}>
            <Col span={16}>
                <div>
                    <Carousel dots={true}>
                        {data.post.images.map(image => {
                            return (
                                <div
                                    key={image.id}
                                    style={{
                                        display: "flex !important",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        src={image?.imgLink}
                                        style={{
                                            objectFit: "contain",
                                            height: "64vh",
                                            width: "664px",
                                            verticalAlign: "middle",
                                        }}
                                        alt={`image_post_${post.id}`}
                                    />
                                </div>
                            )
                        })}
                    </Carousel>
                </div>
            </Col>
            <Col span={8}>
                <div className={styles.post_card}>
                    <Row
                        gutter={[2, 24]}
                        className={styles.card_header}
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                    >
                        <Col>
                            <Space>
                                <Avatar src={post?.owner?.avatar} icon={<UserOutlined />} />
                                <div style={{ width: "100%" }} >
                                    <div style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                                        <span>
                                            <strong style={{ padding: 0 }}>{post?.owner?.username}</strong>
                                            <span> đang cảm thấy {statusIcons[post?.status]?.name.toLowerCase()} {statusIcons[post?.status]?.icon}</span>
                                        </span>
                                        <i style={{ color: "rgba(0, 0, 0, 0.25)", fontSize: "12px", padding: 0, }}>{post?.updatedAt}</i>
                                    </div>
                                </div>
                            </Space>
                        </Col>
                        <Col span={4} style={{ display: "flex", justifyContent: "end", }}>
                            {post?.ownerId === user?.id && (
                                <Dropdown
                                    arrow
                                    // style={{ right: "80px", left: "auto", position: "absolute" }}
                                    placement="bottom"
                                    overlay={
                                        (<Menu
                                            onClick={handleAction}
                                            items={moreActions}
                                        />)
                                    }
                                >
                                    <EllipsisOutlined className={styles.action_icon} />
                                </Dropdown>
                            )}
                        </Col>
                    </Row>
                    <div>
                        <Editor editorState={content} readOnly />
                    </div>
                    <Divider style={{ padding: 0, margin: "8px" }} />
                    <div className={styles.actions}>
                        <div>
                            <Popover
                                content={
                                    (
                                        <Space>
                                            {reactIcons.map(reactIcon => {
                                                return (
                                                    <span
                                                        key={reactIcon.id}
                                                        className={
                                                            react === reactIcon.id ?
                                                                styles.selected_icon :
                                                                styles.react_icon
                                                        }
                                                        onClick={() => handleReact(reactIcon.id)}
                                                    >
                                                        {reactIcon.icon}
                                                    </span>
                                                )
                                            })}
                                        </Space>
                                    )
                                }
                            >
                                {react?.reactType !== null ?
                                    <a>{reactIcons[react?.reactType]?.icon}</a> :
                                    <LikeOutlined className={styles.action_icon} />}
                            </Popover>
                        </div>
                        <Divider type="vertical" />
                        <div>
                            <CommentOutlined className={styles.action_icon} onClick={handleComment} />
                        </div>
                    </div>
                    <Divider style={{ padding: 0, margin: "8px" }} />
                    <Form
                        colon={false}
                        onFinish={handleSendComment}
                        form={form}
                    >
                        <Form.Item
                            label={<Avatar src={user?.avatar} icon={<UserOutlined />} />}
                            name="comment"
                            help={newComment.content.match(new RegExp(/^@\w+/)) && `Trả lời ${newComment.content.split('@')[1].split(' ')[0]}`}
                        >
                            <Input
                                onChange={(e) => {
                                    setNewComment({
                                        ...newComment,
                                        content: e.target.value,
                                    })
                                }}
                                placeholder="Bình luận gì đó?"
                                ref={commentInputRef}
                            />
                        </Form.Item>
                    </Form>
                    <div className={styles.comments_list}>
                        {comments?.map(comment => {
                            return (
                                <CustomComment key={comment.id} comment={comment} />
                            )
                        })}
                    </div>
                </div>
            </Col>
        </Row>
    )
}