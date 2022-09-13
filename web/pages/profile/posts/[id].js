import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ProfileLayout from "../../../layout/AuthLayout/ProfileLayout";
import { UserContext } from "../../../providers/UserProvider";
import axios from "../../api/axios";
import PostsList from "./PostsList";
import UpPostBar from "./UpPostBar";
import styles from "../../../styles/ProfilePosts.module.css"
import TopReactList from "./TopReactList";

export default function ProfilePosts() {
    const router = useRouter()
    const { user: authUser } = useContext(UserContext)
    const [user, setUser] = useState()

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
                    setUser(res.data.user)
                } else {
    
                }
            }
    
            getUser(id)
        }
    }, [router])

    return (
        <ProfileLayout user={user}>
            <div className={styles.container}>
                <div className={styles.posts_list}>
                    {authUser?.id === user?.id && (<UpPostBar user={user} />)}
                    <PostsList userId={user?.id} />
                </div>
                <TopReactList user={user} />
            </div>
        </ProfileLayout>
    )
}