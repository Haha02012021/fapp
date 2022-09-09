import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Dropdown, Form, Input, InputNumber, Modal, Row, Select, Tag, Upload } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import UploadImage from "../../../components/UploadImage";
import AuthLayout from "../../../layout/AuthLayout";
import axios from "../../api/axios";
import { uploadImage } from "../../api/firebase";
import { useRouter } from "next/router";
import { UserContext } from "../../../providers/UserProvider";
import { ActionsContext } from "../../../providers/ActionsProvider";

const { Option } = Select;

const sexs = ['Nam', 'Nữ', 'Khác'];

const emotionStates = ['Độc thân', 'Crush', 'Thả thính', 'Hẹn hò', 'Kết hôn'];

const bloodTypes = ["O", "A", "B", "AB"];

export default function ProfileEdit() {
    const { user, setUser } = useContext(UserContext)
    const { setLoading } = useContext(ActionsContext)
    const [characters, setCharacters] = useState([])
    const [selectedCharacters, setSelectedCharacter] = useState([])
    const [form] = Form.useForm()
    const router = useRouter()

    useEffect(() => {
        console.log("user", user);
        form.setFieldsValue({
            fullname: user?.fullname,
            avatar: user?.avatar,
            age: user?.age,
            height: user?.height,
            weight: user?.weight,
            phoneNumber: user?.phoneNumber,
            bloodType: user?.bloodType,
            toward: user?.toward,
            sex: user?.sex,
            emotionState: user?.emotionState,
            characters: user?.characters.map(character => character.id) || [],
        })

        setSelectedCharacter(user?.characters.map(character => character.id) || [])

        const fetchAllCharacters = async () => {
            const res = await axios.get('character/get-all')
                .then(res => res.data)
                .catch(err => console.log(err.message))
            
            if (res.success) {
                console.log("characters", res.data);
                setCharacters(res.data)
            }
        }

        fetchAllCharacters()
    }, [user])

    const handleClickCharacter = (values) => {
        console.log(values);
        
        if (values.length <= 3) {
            setSelectedCharacter(values)
            //form.setFieldValue("characters", values)
        } else {
            toast.error('Bạn chỉ có thể chọn 3 tính cách!', {
                position: "top-center",
                autoClose: 1800,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    }

    const handleChangeImg = (img) => {
        console.log("img", img);
        form.setFieldValue("avatar", img)
    }

    const handleSave = async (values) => {
        setLoading(true)
        if (values.avatar && values.avatar !== user.avatar) {
            const avatar = await uploadImage(values.avatar, "avatars")
            if (avatar) {
                form.setFieldValue("avatar", avatar)
            }
        }

        console.log("form", form.getFieldsValue());
        console.log("user", user);
        const resData = await axios.put(`user/${user.id}/edit`, form.getFieldsValue())
            .then((res) => {
                console.log(res.data);
                return res.data
            })
            .catch(err => {
                return {
                    success: false,
                    message: err.message,
                };
            })
        
        if (resData.success) {
            setLoading(false)
            setUser(resData.data)

            const oldUser = JSON.parse(localStorage.getItem("user"))
            localStorage.setItem("user", JSON.stringify(
                {
                    ...oldUser,
                    token: resData.access_token,
                }
            ))

            toast.success('Chỉnh sửa thông tin thành công!', {
                position: "top-right",
                autoClose: 1800,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                router.push(`/profile/detail/${user.id}`)
            }, 2000)
        } else {
            toast.error(resData.message, {
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

    const handleSkip = () => {
        Modal.confirm({
            title: 'Thay đổi của bạn sẽ không được lưu!',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc muốn chuyển hướng không?',
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => {
                if (router.query.first) {
                    return router.push('/home')
                } else {
                    return router.back()
                }
            }
        });
    }

    return (
        <AuthLayout headTitle={"Chỉnh sửa thông tin"}>
            <Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // height: "100vh",
                    paddingTop: "40px",
                    paddingBottom: "40px",
                }}
            >
                <Form
                    name='sign-in'
                    labelCol={{
                        span: 4,
                    }}
                    labelAlign="left"
                    style={{
                        width: "64%",
                        border: "1px solid rgba(0, 0, 0, 0.06)",
                        borderRadius: "2px",
                        padding: "32px",
                        height: "fit-content",
                        backgroundColor: "white",
                    }}
                    form={form}
                    onFinish={handleSave}
                >
                    <div
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        Chỉnh sửa thông tin
                    </div>
                    <Divider />
                    <div>
                        <Form.Item
                            style={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                            name="avatar"
                            rules={[
                                {required: true}
                            ]}
                        >
                            <UploadImage
                                name="avatar"
                                image={user?.avatar}
                                handleChangeImg={(selectedImg) => handleChangeImg(selectedImg)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Họ và tên"
                            labelAlign="left"
                            name="fullname"
                            rules={[
                                {required: true}
                            ]}
                        >
                            <Input
                                name="fullname"
                            />
                        </Form.Item>
                        <Row gutter={[2, 24]} justify="space-between">
                            <Col span={12}>
                                <Form.Item
                                    label="Tuổi"
                                    labelAlign="left"
                                    name="age"
                                    labelCol={{ span: 8, }}
                                    wrapperCol={{ span: 20, }}
                                    rules={[
                                        {required: true}
                                    ]}
                                >
                                    <InputNumber min={18} max={90} name="age" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    label="Giới tính"
                                    labelAlign="left"
                                    name="sex"
                                    labelCol={{ span: 8, }}
                                    rules={[
                                        {required: true}
                                    ]}
                                >
                                    <Select
                                        defaultValue={sexs[0]}
                                    >
                                        {sexs.map((sex, index) => {
                                            return (
                                                <Option value={index}>{sex}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[2, 24]} justify="space-between">
                            <Col span={12}>
                                <Form.Item
                                    label="Chiều cao"
                                    labelAlign="left"
                                    name="height"
                                    labelCol={{ span: 8, }}
                                    wrapperCol={{ span: 20, }}
                                    rules={[
                                        {required: true}
                                    ]}
                                >
                                    <InputNumber min={0} name="height" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    label="Cân nặng"
                                    labelAlign="left"
                                    name="weight"
                                    labelCol={{ span: 8, }}
                                    rules={[
                                        {required: true}
                                    ]}
                                >
                                    <InputNumber min={0} name="weight" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="Số điện thoại"
                            labelAlign="left"
                            name="phoneNumber"
                            rules={[
                                {required: true}
                            ]}
                        >
                            <Input type="tel" />
                        </Form.Item>
                        <Form.Item
                            label="Nhóm máu"
                            labelAlign="left"
                            name="bloodType"
                            rules={[
                                {required: true}
                            ]}
                        >
                            <Select>
                                {bloodTypes.map((bloodType, index) => {
                                    return (
                                        <Option key={index} value={index}>{bloodType}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Row gutter={[2, 24]} justify="space-between">
                            <Col span={12}>
                                <Form.Item
                                    label="Đối tượng"
                                    labelAlign="left"
                                    name="toward"
                                    labelCol={{ span: 8, }}
                                    // wrapperCol={{ span: 24, }}
                                    rules={[
                                        {required: true}
                                    ]}
                                >
                                    <Select
                                        defaultValue={sexs[0]}
                                        name="toward"
                                        style={{ width: "100%" }}
                                    >
                                        {sexs.map((sex, index) => {
                                            return (
                                                <Option value={index}>{sex}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            
                            <Col span={10}>
                                <Form.Item
                                    label="Đang"
                                    labelAlign="left"
                                    name="emotionState"
                                    labelCol={{ span: 8, }}
                                    rules={[
                                        {required: true}
                                    ]}
                                >
                                    <Select
                                        defaultValue={emotionStates[0]}
                                        name="emotionState"
                                    >
                                        {emotionStates.map((emotionState, index) => {
                                            return (
                                                <Option value={index}>{emotionState}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="Tính cách"
                            labelAlign="left"
                            name="characters"
                            rules={[
                                {required: true}
                            ]}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Hãy chọn 3 tính cách đúng với bạn nhất!"
                                onChange={handleClickCharacter}
                                maxTagCount="3"
                                defaultValue={selectedCharacters}
                                optionLabelProp="label"
                            >
                                {characters.map((character, index) =>
                                    <Option
                                        key={character.id}
                                        value={character.id}
                                        label={character.name}
                                        disabled={selectedCharacters.length >= 3 ?
                                            selectedCharacters.includes(character.id) ? false : true : false
                                        }
                                    >{character.name}</Option>
                                )}
                            </Select>
                        </Form.Item>
                    </div>
                    <Button
                        style={{ width: "100%", marginBottom: "8px" }}
                        type="primary"
                        htmlType="submit"
                    >
                        Lưu
                    </Button>
                    <Row justify="center">
                        <Button type="link" onClick={handleSkip}>Để sau</Button>
                    </Row>
                </Form>
            </Content>
        </AuthLayout>
    )
}