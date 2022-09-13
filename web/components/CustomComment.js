import { DeleteOutlined, EditOutlined, EllipsisOutlined, ExclamationOutlined, MoreOutlined } from "@ant-design/icons";
import { Comment, Dropdown, Menu, Modal, Space } from "antd";
import { useContext } from "react";
import { toast } from "react-toastify";
import axios from "../pages/api/axios";
import { CommentContext } from "../providers/CommentProvider";
import { UserContext } from "../providers/UserProvider";

export default function CustomComment({ comment }) {
    const { user: authUser } = useContext(UserContext)
    const { setComments, setNewComment } = useContext(CommentContext)
    const handleReply = () => {
        setNewComment({
            content: `@${comment.owner.username} `,
            parentId: comment.id,
        })
    }

    const handleAction = async (op) => {
        if (op.key === 'edit') {
            const {childComments, ...editComment} = comment
            setNewComment({
                ...editComment,
                state: 'edit',
            })
        } else if (op.key === 'delete') {
            Modal.confirm({
                title: "Bạn sẽ không thể thấy bình luận này nữa!",
                content: "Bạn có chắc chắn muốn xóa không?",
                icon: <ExclamationOutlined />,
                okText: "Xóa",
                cancelText: "Bỏ qua",
                okButtonProps: {
                    type: "danger",
                },
                onOk: async () => {
                    const {childComments, ...data} = comment
                    const res = await axios.delete(`comment/delete/${comment.id}`, {
                        data,
                    })
                        .then(res => res.data)
                        .catch(err => {
                            return {
                                success: false,
                                message: err.message,
                            }
                        })
                    if (res.success) {
                        toast.success('Xóa bình luận thành công!', {
                            position: "top-right",
                            autoClose: 1800,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setComments(res.data)
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
                }
            })
        }
    }

    return (
        <Comment
            actions={[
                <a onClick={handleReply}>Trả lời</a>,
                comment.owner.id === authUser?.id && (
                    <Dropdown
                        arrow
                        overlay={(
                            <Menu
                                items={[
                                    {
                                        key: 'edit',
                                        label: "Sửa",
                                        icon: <EditOutlined />,
                                    },
                                    {
                                        key: 'delete',
                                        label: "Xóa",
                                        icon: <DeleteOutlined />,
                                    }
                                ]}
                                onClick={handleAction}
                            />
                        )}
                    >
                        <span style={{ paddingLeft: "8px", }}><EllipsisOutlined /></span>
                    </Dropdown>
                )
            ]}
            author={comment.owner.username}
            avatar={comment.owner.avatar}
            content={comment.content}
            datetime={(new Date(comment.updatedAt)).toLocaleString()}
        >
            {comment.childComments?.map(cmt => {
                return (
                    <CustomComment key={cmt.id} comment={cmt} />
                )
            })}
        </Comment>
    )
}