import { Layout } from "antd";
import AuthLayout from "..";
import UserCard from "../../../components/UserCard";
import ProfileMenu from "./ProfileMenu";

const { Content } = Layout

export default function ProfileLayout({ user, children }) {
    return (
        <AuthLayout>
            <ProfileMenu userId={user?.id} />
            <Content
                style={{
                    minHeight: "calc(100vh - 112px)",
                    display: "flex"
                }}
            >
                <div
                    style={{
                        position: "fixed",
                        top: "140px",
                        left: "80px",
                        width: "fit-content",
                        paddingRight: "80px",
                    }}
                >
                    <UserCard user={user} />
                </div>
                <div
                    style={{
                        marginLeft: "420px",
                        marginTop: "34px",
                        width: "100%",
                        marginRight: "80px",
                    }}
                >
                    { children }
                </div>
            </Content>
        </AuthLayout>
    )
}