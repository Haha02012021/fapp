import { Alert, Button, Divider, Form, Input, Layout, Spin, } from 'antd';
import Head from 'next/head';
import { useContext, useState } from 'react';
import { UserContext } from '../../providers/UserProvider';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useSocket from '../../hooks/useSoket';
import { io } from 'socket.io-client';
import { ActionsContext } from '../../providers/ActionsProvider';
import Link from 'next/link';

const { Content } = Layout;

export let socket

export default function Login() {
    const { setUser } = useContext(UserContext)
    const [isLoading, setLoading] = useState(false)
    const [errorMsgs, setErrorMsgs] = useState([])
    const router = useRouter()

    const handleLogin = async (values) => {
        setErrorMsgs([])
        if (values.account && values.password) {
            setLoading(true)
            const res = await axios.post(
                'auth/signin',
                values
            )
                .then(res => {
                    return res.data
                })
                .catch(err => {
                    toast.error(err.message, {
                        position: "top-right",
                        autoClose: 1800,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })

                    return {
                        success: false,
                        message: err.message,
                    }
                })            
            const now = new Date()
            if (res?.success) {
                const user = res.data
                const item = {
                    token: res.access_token,
                    expiry: now.valueOf() + 1000 * 60 * 60 * 2,
                }
                setUser(user)
                localStorage.setItem('user', JSON.stringify(item))
                setLoading(false)
                toast.success('????ng nh???p th??nh c??ng!', {
                    position: "top-right",
                    autoClose: 1800,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                if (user.createdAt === user.updatedAt) {
                    setTimeout(() => {
                        router.push(`profile/edit?first=true`)
                    }, 2000)
                } else {
                    setTimeout(() => {
                        router.push('/home')
                    }, 2000)
                }
            } else {
                setLoading(false)
                toast.error('????ng nh???p th???t b???i!', {
                    position: "top-right",
                    autoClose: 1800,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setErrorMsgs((errorMsg) => [...errorMsg, res.message])
            }
        }
    }

    return (
        <Layout>
            <Head>
                <title>DApp - ????ng nh???p</title>
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
                    onFinish={handleLogin}
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
                        ????ng nh???p
                    </div>
                    <Divider />
                    <div>
                        <Form.Item
                            label="T??i kho???n"
                            name="account"
                            rules={[
                                {
                                    required: true,
                                    message: "H??y nh???p username ho???c email"
                                }
                            ]}
                        >
                            <Input
                                // prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder='Username ho???c Email'
                            />
                        </Form.Item>
                        <Form.Item
                            label="M???t kh???u"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "H??y nh???p m???t kh???u"
                                }
                            ]}
                        >
                            <Input.Password
                                // prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder='M???t kh???u'
                            />
                        </Form.Item>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "4px",
                        }}
                    >
                        <Link href="#">Qu??n m???t kh???u?</Link>
                        <span>Ch??a c?? m???t kh???u? <Link href="/register">????ng k??!</Link></span>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                            {isLoading ? <Spin /> : "????ng nh???p"}
                        </Button>
                    </Form.Item>
                    {errorMsgs.map((errorMsg, index) => {
                        return <Alert key={index} message={errorMsg} type="error" showIcon />
                    })}
                </Form>
            </Content>
        </Layout>
    )
}