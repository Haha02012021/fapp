import { createContext, useContext, useEffect, useState } from "react"
import useSocket from "../hooks/useSoket"
import { UserContext } from "./UserProvider"

export const ActionsContext = createContext()

export default function ActionsProvider({ children }) {
    const [isShowPostFormModal, setShowPostFormModal] = useState(false)
    const [currentPost, setCurrentPost] = useState()
    const [isLoading, setLoading] = useState(false)
    const [socketRef, socketCreated] = useSocket()
    const [onlineUsers, setOnlineUsers] = useState([])

    return (
        <ActionsContext.Provider
            value={{
                isShowPostFormModal,
                setShowPostFormModal,
                currentPost,
                setCurrentPost,
                isLoading,
                setLoading,
                socketRef,
                socketCreated,
                onlineUsers,
                setOnlineUsers
            }}
        >
            { children }
        </ActionsContext.Provider>
    )
}