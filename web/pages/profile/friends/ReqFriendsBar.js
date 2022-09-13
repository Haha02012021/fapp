import { useEffect, useRef, useState } from "react"
import ReqFriendCard from "../../../components/ReqFriendCard"
import axios from "../../api/axios"
import styles from "../../../styles/ReqFriendsBar.module.css"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { Typography } from "antd"

export default function ReqFriendsBar({ userId, handleNewFriend }) {
    const [reqFriends, setReqFriends] = useState([])
    const [isShowBeforeBtn, setShowBeforeBtn] = useState(false)
    const [isShowNextBtn, setShowNextBtn] = useState(true)

    const barRef = useRef()

    useEffect(() => {
        if (userId) {
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
                    setReqFriends(res.data)
                } else {
                    
                }
            }
    
            getReqFriends(userId)
        }

    }, [userId])

    useEffect(() => {
        if (barRef?.current?.scrollWidth <= barRef?.current?.clientWidth) {
            setShowNextBtn(false)
        }
    }, [barRef.current])

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft
        const scrollWidth = e.target.scrollWidth
        const clientWidth = e.target.clientWidth
        if (scrollLeft >= 8 && !isShowBeforeBtn) {
            setShowBeforeBtn(true)
        } else if (scrollLeft < 8 && isShowBeforeBtn) {
            setShowBeforeBtn(false)
        }
        if (scrollLeft > scrollWidth - clientWidth - 32 && isShowNextBtn) {
            setShowNextBtn(false)
        } else if (scrollLeft <= scrollWidth - clientWidth - 32 && !isShowNextBtn) {
            setShowNextBtn(true)
        }
    }

    const handleBeforeBtn = () => {
        barRef.current.scrollBy({
            left: - barRef.current.clientWidth + 40,
            top: 0,
            behavior: "smooth",
        })
    }

    const handleNextBtn = () => {
        barRef.current.scrollBy({
            left: barRef.current.clientWidth - 40,
            top: 0,
            behavior: "smooth",
        })
    }

    const handleAcceptUser = (newFriend) => {
        const newReqFriends = reqFriends.filter(reqFriend => reqFriend.user.id !== newFriend.id)
        setReqFriends(newReqFriends)

        handleNewFriend(newFriend)
    }

    return (
        <>
            {
                reqFriends?.length > 0 ?
                    (
                        <div className={styles.req_friends_bar} ref={barRef} onScroll={handleScroll}>
                            {isShowBeforeBtn && (
                                <div className={styles.before_button} onClick={handleBeforeBtn}>
                                    <ArrowLeftOutlined />
                                </div>
                            )}
                            {reqFriends?.map((reqFriend, index) => {
                                return (
                                    <div
                                        key={index}
                                        style={{ paddingLeft: "4px", paddingRight: "4px", }}
                                    >
                                        <ReqFriendCard
                                            user={reqFriend.user}
                                            handleAcceptUser={(newFriend) => handleAcceptUser(newFriend)}
                                            handleRefuseUser={(refusedFriend) => setReqFriends(reqFriends.filter(reqFriend => reqFriend.user.id !== refusedFriend.id))}
                                        />
                                    </div>
                                )
                            })}
                            {isShowNextBtn && (
                                <div className={styles.next_button} onClick={handleNextBtn}>
                                    <ArrowRightOutlined />
                                </div>
                            )}
                        </div>
                    ) :
                    (
                        <Typography.Text disabled italic>Hiện tại, không ai gửi lời mời kết bạn cho bạn cả!</Typography.Text>
                    )
            }
        </>
    )
}