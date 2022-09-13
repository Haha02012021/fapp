import { Typography } from "antd"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import ProfileLayout from "../../../layout/AuthLayout/ProfileLayout/index"
import { UserContext } from "../../../providers/UserProvider"
import axios from "../../api/axios"
import FriendsList from "./FriendsList"
import ReqFriendsBar from "./ReqFriendsBar"

export default function ProfileFriends() {
    const router = useRouter()
    const { id } = router.query
    const { user: authUser } = useContext(UserContext)
    const [user, setUser] = useState()
    const [newFriend, setNewFriend] = useState()

    useEffect(() => {
        if (id) {
            const getUser = async (id) => {
                const res = await axios.get(`user/get/${id}`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    setUser(res.data.user)
                } else {
                    
                }
            }
    
            getUser(id)
        }
    }, [router])

    return (
        <ProfileLayout user={user}>
            {authUser?.id == id && (
                <div>
                    <Typography.Title level={4}>Đang chờ trở thành bạn</Typography.Title>
                    <ReqFriendsBar userId={id} handleNewFriend={(newFriend) => setNewFriend(newFriend)} />
                </div>
            )}
            <div>
                <Typography.Title level={4}>Bạn bè</Typography.Title>
                <FriendsList user={user} newFriend={newFriend} />
            </div>
        </ProfileLayout>
    )
}