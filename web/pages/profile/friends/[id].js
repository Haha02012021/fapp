import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import ProfileLayout from "../../../layout/AuthLayout/ProfileLayout/index"
import { UserContext } from "../../../providers/UserProvider"
import axios from "../../api/axios"

export default function ProfileFriends() {
    const router = useRouter()
    const { user: authUser } = useContext(UserContext)
    const [user, setUser] = useState()
    const [reqFriends, setReqFriends] = useState([])

    useEffect(() => {
        const { id } = router.query

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
                    // console.log(res.data);
                    setUser(res.data.user)
                } else {
                    
                }
            }
    
            getUser(id)

            const getReqFriends = async (id) => {
                const res = await axios.get(`user/${id}/get-req-friends`)
                    .then(res => res.data)
                    .catch(err => {
                        return {
                            success: false,
                            message: err.message,
                        }
                    })
                
                if (res.success) {
                    console.log("reqFriends", res.data);
                    setReqFriends(res.data)
                } else {
                    
                }
            }

            getReqFriends(id)
        }
    }, [router])

    return (
        <ProfileLayout user={user}>

        </ProfileLayout>
    )
}