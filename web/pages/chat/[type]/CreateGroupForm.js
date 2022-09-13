import { CheckCircleTwoTone, ClockCircleFilled, CloseCircleFilled, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Form, Input, Row, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/UsersModal.module.css";
import { UserContext } from "../../../providers/UserProvider";
import axios from "../../api/axios";
import UploadImage from "../../../components/UploadImage";
import { uploadImage } from "../../api/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function CreateGroupForm() {
    const { user: authUser } = useContext(UserContext)
    const [friends, setFriends] = useState([])
    const [selectedFriends, setSelectedUsers] = useState([])
    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (authUser) {
            const getFriends = async () => {
                const res = await axios.get(`user/${authUser.id}/get-friends`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    setFriends(res.data)
                }
            }

            getFriends()
        }
    }, [authUser])

    const handleSearch = async (e) => {
        const searchValue = e.target.value

        if (authUser) {
            const res = await axios.get('user/get-friends-by-search', {
                params: {
                    id: authUser.id,
                    searchValue,
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
                setFriends(res.data)
            }
        }

    }

    const handleSelectFriend = (friend) => {
        const findIndex = selectedFriends.findIndex(selectedFriend => selectedFriend.id === friend.id)
        let newSelectedFriends = []
        if (findIndex >= 0) {
            newSelectedFriends = selectedFriends.filter(selectedFriend => selectedFriend.id !== friend.id)
        } else {
            newSelectedFriends = [...selectedFriends, friend]
        }
        
        setSelectedUsers(newSelectedFriends)
        form.setFieldValue('members', newSelectedFriends)
    }

    const handleRemoveFriend = (index) => {
        let newSelectedFriends = [...selectedFriends]
        newSelectedFriends.splice(index, 1)

        setSelectedUsers(newSelectedFriends)
        form.setFieldValue('members', newSelectedFriends)
    }

    const handleChangeGroupAvatar = (image) => {
        form.setFieldValue('avatar', image)
    }

    const handleCreateGroup = async (values) => {
        setLoading(true)
        const req = { ...values }

        const url = await uploadImage(values.avatar, `chat/avatar`)

        req.avatar = url
        req.ownerId = authUser.id

        const res = await axios.post('chat/create-group', req)
            .then(res => res.data)
            .catch(err => {
                return {
                    success: false,
                    message: err.message,
                }
            })
        
        if (res.success) {
            setLoading(false)
            toast.success(`Tạo nhóm thành công!`, {
                position: "top-right",
                autoClose: 1800,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                router.push(`/chat/1/${res.data.id}`)
            }, 2000)
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

    return (
        <Spin spinning={isLoading} size="large">
            <Form
                layout="vertical"
                onFinish={handleCreateGroup}
                form={form}
            >
                <Form.Item
                    label="Tên nhóm"
                    name="name"
                    rules={[
                        { required: true, message: "Hãy nhập tên nhóm!" }
                    ]}
                >
                    <Input placeholder="Nhập tên nhóm" />
                </Form.Item>
                <Form.Item
                    label="Ảnh đại diện nhóm"
                    name="avatar"
                >
                    <UploadImage handleChangeImg={(image) => handleChangeGroupAvatar(image)} />
                </Form.Item>
                <Form.Item
                    label="Thêm bạn bè"
                    name="members"
                    rules={[
                        { required: true, message: "Hãy thêm ít nhất 2 bạn!" },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                            if (selectedFriends.length >= 2) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject(`Hãy thêm ít nhất ${2- selectedFriends.length} bạn!`)
                            }
                            }
                        })
                    ]}
                >
                    <Row style={{ paddingBottom: "8px", }}>
                        <Input
                            placeholder="Tìm bạn theo tên người dùng"
                            prefix={<SearchOutlined color="gray" />}
                            onChange={handleSearch}
                        />
                    </Row>
                    <Row
                        className={styles.members_box}
                    >
                        {selectedFriends?.map((selectedFriend, index) => {
                            return (
                                <Col key={index} span={2}>
                                    <Col>
                                        <Badge
                                            count={(
                                                <CloseCircleFilled onClick={() => handleRemoveFriend(index)} className={styles.badge_count} />
                                            )}
                                            offset={[-2, 6]}
                                        >
                                            <Avatar src={selectedFriend?.avatar} icon={<UserOutlined />} />
                                        </Badge>
                                    </Col>
                                    <Col>
                                        <b>{selectedFriend?.username}</b>
                                    </Col>
                                </Col>
                            )
                        })}
                    </Row>
                    <div className={styles.friends_box}>
                        <Row
                            gutter={[2, 24]}
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            {friends?.map((friend, index) => {
                                return (
                                    <Col
                                        key={index}
                                        className={styles.user}
                                        style={{
                                            display: "flex",
                                            paddingRight: "4px",
                                            paddingLeft: "4px",
                                        }}
                                        span={11}
                                        onClick={() => handleSelectFriend(friend)}
                                    >
                                        <Col span={4}>
                                            <Avatar size={48} shape="square" src={friend?.avatar} icon={<UserOutlined />} />
                                        </Col>
                                        <Col span={18}>
                                            <b>{friend?.username}</b>
                                        </Col>
                                        <Col span={2}>
                                            {selectedFriends.findIndex(selectedFriend => selectedFriend.id === friend.id) >= 0 && (
                                                <CheckCircleTwoTone />
                                            )}
                                        </Col>
                                    </Col>
                                )
                            })}
                        </Row>
                    </div>
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%", }}>
                    Tạo nhóm
                </Button>
            </Form>
        </Spin>
    )
}