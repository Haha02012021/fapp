import { Button, Divider, Form, Input, Layout, Spin } from "antd";
import Head from "next/head";
import axios from "../api/axios";
import { useState } from "react";
import { useRouter } from "next/router"
import { toast, ToastContainer } from "react-toastify";

const { Content } = Layout;

export default function Register() {
    const [isLoading, setLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async (values) => {
        setLoading(true)
        const res = await axios.post('auth/signup', values)
            .then(res => {
                return res.data
            })
            .catch(err => {
                return {
                    success: false,
                    message: err.message,
                }
            }) 
        
        if (res.success) {
            setLoading(false)
            toast.success('Đăng ký thành công!', {
                position: "top-right",
                autoClose: 1800,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                router.push("/login")
            }, 5000)
        } else {
            setLoading(false)
            toast.error('Đăng ký thất bại!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }
    return (
        <Layout>
            <Head>
                <title>DApp - Đăng ký</title>
            </Head>
            <Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Form
                    name='sign-in'
                    labelCol={{
                        span: 6,
                    }}
                    labelAlign="left"
                    style={{
                        width: "36%",
                        border: "1px solid rgba(0, 0, 0, 0.06)",
                        borderRadius: "2px",
                        padding: "32px",
                        height: "fit-content",
                        backgroundColor: "white",
                    }}
                    onFinish={handleRegister}
                    className="form"
                >
                    <div
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        Đăng ký
                    </div>
                    <Divider />
                    <div>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập username"
                                }
                            ]}
                        >
                            <Input
                                // prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder='Username'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập email"
                                }
                            ]}
                        >
                            <Input
                                // prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder='Email'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập mật khẩu"
                                }
                            ]}
                        >
                            <Input.Password
                                // prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder='Mật khẩu'
                            />
                        </Form.Item>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            paddingBottom: "4px",
                        }}
                    >
                        <span>Đã có mật khẩu? <a href="/login">Đăng nhập!</a></span>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                            {isLoading ? <Spin /> : "Đăng ký"}
                        </Button>
                    </Form.Item>
                </Form>

            </Content>
        </Layout>
    )
}