import { Avatar, Button, Col, Divider, Modal, Row, Space, Tooltip, Typography, Upload } from "antd";
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useContext, useEffect, useState } from "react";
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { ArrowLeftOutlined, CheckCircleTwoTone, FileImageTwoTone, InboxOutlined, SmileFilled, SmileTwoTone, UserOutlined } from "@ant-design/icons";
import styles from "../../../styles/PostFormModal.module.css"
import { ActionsContext } from "../../../providers/ActionsProvider";
import { statusIcons } from "../../../constant/statusIcons";
import { UserContext } from "../../../providers/UserProvider";
import { uploadImage } from "../../api/firebase";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import RichEditor from "../../../components/RichEditor";
import { useRouter } from "next/router";

export default function PostFormModal() {
    const { user } = useContext(UserContext)
    const { currentPost: post, setCurrentPost, setShowPostFormModal, setLoading } = useContext(ActionsContext)
    const [content, setContent] = useState(() => EditorState.createEmpty())
    const [imgList, setImgList] = useState([])
    const [status, setStatus] = useState()
    const [currentTab, setCurrentTab] = useState(null)
    const router = useRouter()

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        if (post?.state === "exist") {
            if (post.content) {
                setContent(EditorState.push(content, convertFromHTML(post.content)))
            }
            const images = post.images.map(image => {
                return {
                    uid: image.uid,
                    name: 'image.jpg',
                    status: "done",
                    url: image.imgLink,
                }
            })
            setImgList(images)
            setStatus({
                id: post.status
            })
        } else {
            setContent(() => EditorState.createEmpty())
            setImgList([])
            setStatus(null)
            if (post?.tab) {
                setCurrentTab(post.tab)
            } else {
                setCurrentTab(null)
            }
        }
    }, [post])

    const handleChangeContent = (values) => {
        setContent(values)
    }

    const handleClickImg = () => {
        setCurrentTab("Ảnh")
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
    });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview));
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url?.substring(file.url?.lastIndexOf('/') + 1));
    };

    const handleClickStatus = () => {
        setCurrentTab("Trạng thái")
    }

    const handleChangeData = (data) => {
        if (currentTab === "Ảnh") {
            setImgList(data)
        } else if (currentTab === "Trạng thái") {
            setStatus(data)
        }
    }

    const handleBack = () => {
        setCurrentTab(null)
    }

    const handleUp = async () => {
        setLoading(true)

        if (!post || post?.tab) {
            const res = await axios.post("post/create", {
                status: status?.id,
                content: convertToHTML(content.getCurrentContent()),
                ownerId: user.id,
            })
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })    
            if (res.success) {
                const images = []
                for (let i = 0; i < imgList.length; i++) {
                    const imgLink = await uploadImage(imgList[i].originFileObj, `post/${res.data.id}`)
    
                    images[i] = {
                        imgLink,
                        type: "post",
                        typeId: res.data.id,
                    }
                }    
                let imgRes = {
                    success: true
                }
                if (images.length > 0) {
                    imgRes = await axios.post("image/save-images", images)
                        .then(res => res.data)
                        .catch(err => {
                            return {
                                success: false,
                                message: err.message,
                            }
                        })
                }

                if (imgRes?.success || imgRes) {
                    setLoading(false)
                    setCurrentPost({
                        state: "new",
                    })
                    toast.success('Tạo bài viết thành công!', {
                        position: "top-right",
                        autoClose: 1800,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setShowPostFormModal(false)

                    const notiRes = await axios.post('notification/create', {
                        ownerId: user.id,
                        content: `${user.username} đã tạo 1 bài viết mới.`,
                        link: router.asPath,
                    })
                        .then(res => res.data)
                        .catch(err => {
                            return {
                                success: false,
                                message: err.message,
                            }
                        })
                } else {
                    setLoading(false)
                    toast.error(imgRes.message, {
                        position: "top-right",
                        autoClose: 1800,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            } else {
                setLoading(false)
                toast.error(res.message, {
                    position: "top-right",
                    autoClose: 1800,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        } else {
            const images = []
            for (let i = 0; i < imgList.length; i++) {
                if (imgList[i].url) {
                    images[i] = {
                        imgLink: imgList[i].url,
                        type: "post",
                        typeId: post.id,
                    }
                } else {
                    const imgLink = await uploadImage(imgList[i].originFileObj, `post/${post.id}`)

                    images[i] = {
                        imgLink,
                        type: "post",
                        typeId: post.id,
                    }
                }
            }

            const res = await axios.put(`post/${post.id}/edit`, {
                images,
                status: status?.id,
                content: convertToHTML(content.getCurrentContent()),
                ownerId: user.id,
            })
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })

            if (res.success) {
                setLoading(false)
                toast.success('Chỉnh sửa bài viết thành công!', {
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
                setLoading(false)
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

    return (
        <>
            {
                currentTab === "Ảnh" ? 
                    (<ImgTab imgs={imgList} handleChangeData={(data) => handleChangeData(data)} handleBack={handleBack} />) :
                    currentTab === "Trạng thái" ?
                        (<StatusTab defaultStatus={status} handleChangeData={(data) => handleChangeData(data)} handleBack={handleBack} />) :
                        (
                            <>
                                <ContentTab
                                    contentTitle={post ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                                    defaultContent={content} handleChangeContent={(values) => handleChangeContent(values)}
                                    currentStatus={status}
                                />
                                {imgList.length > 0 && (
                                    <Upload
                                        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        listType="picture-card"
                                        fileList={imgList}
                                        onPreview={handlePreview}
                                        showUploadList={{
                                            removeIcon: (<></>),
                                        }}
                                        style={{
                                            marginTop: "20px",
                                        }}
                                    />
                                )}
                                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                            </>)
            }

            <Row style={{ width: "100%" }}>
                <Divider />
                <Row style={{ width: "100%", display: "flex", justifyContent: "end", }}>
                    <Space size={4}>
                        <Tooltip onClick={handleClickImg} title="Ảnh" className={styles.extra_action}>
                            <FileImageTwoTone />
                        </Tooltip>
                        <Tooltip onClick={handleClickStatus} title="Trạng thái" className={styles.extra_action}>
                            <SmileTwoTone />
                        </Tooltip>
                    </Space>
                </Row>
                {currentTab === null &&
                    <Button
                        style={{ width: "100%" }}
                        type="primary"
                        onClick={handleUp}
                    >
                        {post ? "Lưu" : "Đăng"}
                    </Button>
                }
            </Row>
        </>
    )
}

function ContentTab({ defaultContent, contentTitle, currentStatus, handleChangeContent }) {
    const { user } = useContext(UserContext)

    const handleChangeEditor = (values) => {
        handleChangeContent(values)
    }

    return (
        <div>
            <div style={{ display: "inline" }}>
                <Typography.Title level={3}>
                    {contentTitle}
                </Typography.Title>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", paddingBottom: "8px", }}>
                <Avatar src={user?.avatar} icon={<UserOutlined />} />
                <div style={{ paddingLeft: "4px", fontWeight: "400" }}>
                    <strong>{user?.username}</strong>
                    {currentStatus && (
                        <span> đang cảm thấy {statusIcons[currentStatus.id]?.name.toLowerCase()} - {statusIcons[currentStatus.id]?.icon}</span>
                    )}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                }}
            >
                <div
                    style={{
                        width: "98%"
                    }}  
                >
                    <RichEditor
                        defaultState={defaultContent}
                        onChange={handleChangeEditor}
                        placeholder="Muốn chia sẻ điều gì?"
                    />
                </div>
                <Tooltip title="Emoji" className={styles.emoji}>
                    <SmileFilled />
                </Tooltip>
            </div>
        </div>
    )
}

const { Dragger } = Upload

function ImgTab({ imgs, handleBack, handleChangeData }) {
    const [imgList, setImgList] = useState(imgs)

    const handleChangeImg = (info) => {     
        setImgList(info.fileList)
        handleChangeData(info.fileList)
    }

    return (
        <div>
            <Typography.Title level={3}>
                <ArrowLeftOutlined
                    className={styles.back_button}
                    onClick={handleBack}
                />
                Thêm ảnh vào bài viết
            </Typography.Title>
            <Dragger
                listType="picture"
                multiple={true}
                fileList={imgList}
                onChange={handleChangeImg}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Nhấp chuột hoặc kéo thả ảnh vào đây!
                </p>
            </Dragger>
        </div>
    )
}

function StatusTab({ defaultStatus, handleBack, handleChangeData }) {
    const [selectedStatus, setSelectedStatus] = useState(null)

    useEffect(() => {
        setSelectedStatus(defaultStatus)
    }, [])

    const handleSelectStatus = (index) => {
        setSelectedStatus(statusIcons[index])
        handleChangeData(statusIcons[index])
    }

    return (
        <div>
            <Typography.Title level={3}>
                <ArrowLeftOutlined
                    className={styles.back_button}
                    onClick={handleBack}
                />
                Chọn trạng thái của bạn
            </Typography.Title>
            <Row gutter={[2, 24]} style={{ display: "flex", justifyContent: "space-around" }}>
                {statusIcons.map((statusIcon, index) => {
                    return (
                        <Col
                            span={10}
                            className={
                                !selectedStatus ?
                                    styles.status_option :
                                    selectedStatus.id === statusIcon.id ?
                                        styles.chosen_option :
                                        styles.disabled_option
                            }
                            onClick={() => handleSelectStatus(index)}
                        >
                            <Space size={8} style={{ paddingLeft: "8px" }}>
                                <div>{statusIcon.icon}</div>
                                <div>{statusIcon.name}</div>
                            </Space>
                            {selectedStatus?.id === statusIcon.id && <CheckCircleTwoTone style={{ paddingRight: "8px" }} />}
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}