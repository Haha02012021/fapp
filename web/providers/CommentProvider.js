import { createContext, useState } from "react"

export const CommentContext = createContext()

export default function CommentProvider({ children }) {
    const [newComment, setNewComment] = useState({
        content: '',
    })
    const [comments, setComments] = useState([])

    return (
        <CommentContext.Provider value={{ comments, setComments, newComment, setNewComment }}>
            {children}
        </CommentContext.Provider>
    )
}