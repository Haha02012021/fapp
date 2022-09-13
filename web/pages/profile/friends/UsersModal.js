import { CheckCircleTwoTone, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Modal, Row, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import axios from "../../api/axios";
import styles from "../../../styles/UsersModal.module.css"
import { UserContext } from "../../../providers/UserProvider";
import { toast } from "react-toastify";

export default function UsersModal({ visible, onCancel }) {
    const {user: authUser} = useContext(UserContext)
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    useState(() => {
        const getCaredTops = async () => {
            const res = await axios.get('user/get-cared-tops')
                .then(res => res.data)
                .catch(err => {
                    return {
                        success: false,
                        message: err.message,
                    }
                })
            
            if (res.success) {
                setUsers(res.data)
            } else {

            }
        }

        getCaredTops()
        return () => setSelectedUsers([])
    }, [])

    useEffect(() => {
        
    }, [users])

    const handleClickUser = (user) => {
        const findIndex = selectedUsers.findIndex(selectedUser => selectedUser.id === user.id)
        let newSelectedUsers = []
        if (findIndex >= 0) {
            newSelectedUsers = selectedUsers.filter(selectedUser => selectedUser.id !== user.id)
        } else {
            newSelectedUsers = [...selectedUsers, user]
        }

        setSelectedUsers(newSelectedUsers)
    }

    const handleOk = async () => {
        const req = selectedUsers.map(selectedUser => {
            return {
                userId: authUser.id,
                friendId: selectedUser.id,
                type: -1,
            }
        })

        const res = await axios.post('user/add-friends', req)
            .then(res => res.data)
            .catch(err => {
                return {
                    success: false,
                    message: err.message,
                }
            })
        if (res.success) {
            toast.success(`Gửi lời mời cho ${selectedUsers.length} người thành công!`, {
                position: "top-right",
                autoClose: 1800,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // setSelectedUsers([])
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
        onCancel()
    }

    return (
        <Modal
            visible={visible}
            onCancel={() => {
                // setSelectedUsers([])
                onCancel()
            }}
            onOk={handleOk}
            okText="Kết bạn"
            cancelText="Bỏ qua"
            title="Được quan tâm nhất gần đây"
        >
            <Row gutter={[1, 24]} style={{ display: "flex", justifyContent: "space-between" }}>
                {users?.map((user) => {
                    return (
                        <Col
                            key={user.id}
                            style={{ display: "flex", }}
                            span={11}
                            className={styles.user}
                            onClick={() => handleClickUser(user)}
                        >
                            <Col span={6} style={{ paddingLeft: "4px" }}>
                                <Avatar size={40} shape="square" src={user?.avatar} icon={<UserOutlined />} />
                            </Col>
                            <Col span={16}>
                                <Row>
                                    {user?.fullname}
                                </Row>
                                <Row>
                                    <Typography.Text disabled italic>@{user?.username}</Typography.Text>
                                </Row>
                            </Col>
                            <Col style={{ paddingRight: "4px" }}>
                                
                            </Col>
                        </Col>
                    )
                })}
            </Row>
        </Modal>
    )
}