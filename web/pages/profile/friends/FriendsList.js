import { Col, Modal, Row, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FriendCard from "../../../components/FriendCard";
import { UserContext } from "../../../providers/UserProvider";
import axios from "../../api/axios";
import UsersModal from "./UsersModal";

export default function FriendsList({ user, newFriend }) {
    const [friends, setFriends] = useState([])
    const { user: authUser } = useContext(UserContext)
    const [isShowUsersModal, setShowUsersModal] = useState(false)

    useEffect(() => {
        if (user) {
            const getFriends = async (id) => {
                const res = await axios.get(`user/${id}/get-friends`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                if (res.success) {
                    setFriends(res.data)
                } else {
                    
                }
            }

            getFriends(user.id)
        }
    }, [user])

    useEffect(() => {
        if (newFriend) {
            setFriends(prev => [...prev, newFriend])
        }
    }, [newFriend])

    return (
        <>
            <Row gutter={[1, 24]}>
                {
                    friends?.length > 0 ?
                        (
                            <>
                                {friends?.map(friend => {
                                    return (
                                        <Col key={friend.id} span={12} style={{ paddingLeft: "8px", paddingRight: "8px", }}>
                                            <FriendCard
                                                friend={friend}
                                                handleDelete={(friendId) => {
                                                    const newFriends = friends.filter(friend => friend.id !== friendId)
                                                    setFriends(newFriends)
                                                }}
                                                user={user}
                                            />
                                        </Col>
                                    )
                                })}
                            </>
                        ) :
                        user?.id === authUser?.id ?
                            (
                                <>
                                    <Typography.Text disabled italic>Hiện tại, bạn không có bạn nào cả! </Typography.Text>
                                    {/* <a onClick={() => setShowUsersModal(true)}><i>Kết bạn ngay!</i></a> */}
                                </>
                            ) :
                            (
                                <>
                                    <Typography.Text disabled italic>Hiện tại, {user?.username} không có bạn nào cả! </Typography.Text>
                                </>
                            )
                }
            </Row>
            <UsersModal
                visible={isShowUsersModal}
                onCancel={() => setShowUsersModal(false)}
            />
        </>
    )
}