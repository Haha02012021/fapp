import { CommentOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, ExclamationCircleOutlined, LikeOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Carousel, Col, Divider, Dropdown, Image, Menu, Modal, Popover, Row, Space, Tooltip } from "antd";
import { Editor, EditorState } from "draft-js";
import styles from "../styles/PostCard.module.css"
import { convertFromHTML } from 'draft-convert';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { ActionsContext } from "../providers/ActionsProvider";
import { statusIcons } from "../constant/statusIcons";
import axios from "../pages/api/axios";
import { toast } from "react-toastify";
import { reactIcons } from "../constant/reactIcons"
import PostDetailModal from "./PostDetailModal";
import CommentProvider from "../providers/CommentProvider";
import { useRouter } from "next/router";
import ReactsListModal from "./ReactsListModal";

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

export default function PostCard({ data }) {
    const { user } = useContext(UserContext)
    const { setShowPostFormModal, setCurrentPost, setNoti} = useContext(ActionsContext)
    const [content, setContent] = useState(() => EditorState.createEmpty())
    const [post, setPost] = useState()
    const [react, setReact] = useState()
    const [isShowDetailModal, setShowDetailModal] = useState(false)
    const [isShowReactsModal, setShowReactsModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const htmlContent = data.post.content
        setContent(EditorState.push(content, convertFromHTML(htmlContent)))

        const localTime = new Date(data.post.updatedAt)
        const localTimeStr = localTime.toLocaleString()

        setPost({
            ...data.post,
            updatedAt: localTimeStr,
        })
        setReact(data.react)
    }, [data]) 

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
                    content: `${user.username} đã bày tỏ về bài viết của bạn.`,
                    toId: post.ownerId,
                    link: router.asPath + `#post_${post.id}`,
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
        setShowDetailModal(true)
    }

    const handleAllReact = () => {
        setShowReactsModal(true)
    }

    return (
        <>
            <div className={styles.post_card} id={`post_${post?.id}`}>
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
                <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "8px", }}>
                    <Carousel autoplay style={{ maxWidth: "624px" }}>
                        {post?.images.map((image, index) => {
                            return (
                                <div key={index}>
                                    <Image src={image.imgLink} style={{ objectFit: "cover", height: "320px", width: "624px", display: "flex", justifyContent: "center" }} />
                                </div>
                            )
                        })}
                    </Carousel>
                </div>
                <div>
                    <Tooltip title={user?.id === post?.ownerId ? "Xem tất cả" : null}>
                        <i>
                            <span onClick={user?.id === post?.ownerId ? handleAllReact : null} className={user?.id === post?.ownerId ? styles.owner_react_content : styles.react_content}>
                                {react?.reactAmount > 0 && react?.reactAmount + " người đã thả cảm xúc"}
                            </span>
                        </i>
                    </Tooltip>
                </div>
                <Divider style={{ padding: 0, margin: "8px" }} />
                <div className={styles.actions}>
                    <div>
                        <Popover
                            content={
                                (
                                    <Space>
                                        {reactIcons.map((reactIcon, index) => {
                                            return (
                                                <span
                                                    key={index}
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
            </div>
            <Modal
                visible={isShowDetailModal}
                onCancel={() => setShowDetailModal(false)}
                width={1000}
                footer={null}
            >
                <CommentProvider>
                    <PostDetailModal data={data} />
                </CommentProvider>
            </Modal>
            <Modal
                visible={isShowReactsModal}
                onCancel={() => setShowReactsModal(false)}
                title="Đã thả cảm xúc"
                footer={null}
            >
                <ReactsListModal reacts={data.post.users} />
            </Modal>
        </>
    )
}