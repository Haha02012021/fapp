import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import ProfileLayout from "../../../layout/AuthLayout/ProfileLayout"
import { UserContext } from "../../../providers/UserProvider"
import axios from "../../api/axios"
import ContactCard from "../../../components/ContactCard"
import ContactBox from "./ContactBox"

export default function ProfileContact() {
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
                    console.log(res.data);
                    setUser(res.data.user)
                } else {
    
                }
            }
    
            getUser(id)
        }
    }, [router])

    return (
        <ProfileLayout user={user}>
            <ContactCard />
            <ContactBox />
        </ProfileLayout>
    )
}