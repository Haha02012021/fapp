import { Avatar, Button, Col, Divider, Image, Modal, Row, Space, Tooltip, Typography, Upload } from "antd";
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
                setContent(prev => EditorState.push(prev, convertFromHTML(post.content)))
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
        setCurrentTab("???nh")
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
        setCurrentTab("Tr???ng th??i")
    }

    const handleChangeData = (data) => {
        if (currentTab === "???nh") {
            setImgList(data)
        } else if (currentTab === "Tr???ng th??i") {
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
                    toast.success('T???o b??i vi???t th??nh c??ng!', {
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
                        content: `${user.username} ???? t???o 1 b??i vi???t m???i.`,
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
                toast.success('Ch???nh s???a b??i vi???t th??nh c??ng!', {
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
                currentTab === "???nh" ? 
                    (<ImgTab imgs={imgList} handleChangeData={(data) => handleChangeData(data)} handleBack={handleBack} />) :
                    currentTab === "Tr???ng th??i" ?
                        (<StatusTab defaultStatus={status} handleChangeData={(data) => handleChangeData(data)} handleBack={handleBack} />) :
                        (
                            <>
                                <ContentTab
                                    contentTitle={post ? "Ch???nh s???a b??i vi???t" : "T???o b??i vi???t m???i"}
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
                                    <Image
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
                        <Tooltip onClick={handleClickImg} title="???nh" className={styles.extra_action}>
                            <FileImageTwoTone />
                        </Tooltip>
                        <Tooltip onClick={handleClickStatus} title="Tr???ng th??i" className={styles.extra_action}>
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
                        {post ? "L??u" : "????ng"}
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
                        <span> ??ang c???m th???y {statusIcons[currentStatus.id]?.name.toLowerCase()} - {statusIcons[currentStatus.id]?.icon}</span>
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
                        placeholder="Mu???n chia s??? ??i???u g???"
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
                Th??m ???nh v??o b??i vi???t
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
                    Nh???p chu???t ho???c k??o th??? ???nh v??o ????y!
                </p>
            </Dragger>
        </div>
    )
}

function StatusTab({ defaultStatus, handleBack, handleChangeData }) {
    const [selectedStatus, setSelectedStatus] = useState(null)

    useEffect(() => {
        setSelectedStatus(defaultStatus)
    }, [defaultStatus])

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
                Ch???n tr???ng th??i c???a b???n
            </Typography.Title>
            <Row gutter={[2, 24]} style={{ display: "flex", justifyContent: "space-around" }}>
                {statusIcons.map((statusIcon, index) => {
                    return (
                        <Col
                            key={index}
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