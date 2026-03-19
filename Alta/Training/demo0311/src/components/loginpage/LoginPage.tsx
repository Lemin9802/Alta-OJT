import React from "react";
import "./styles.css";
import { Form, Input, Button, Space } from "antd";
import type { FormProps } from "antd";

type FieldType = { username: string; password: string; remember: boolean };
type LoginPageProps = {
  handleLogin: (index: number) => void
}

const LoginPage = (props: LoginPageProps) => {
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    // if(values.username== "admin" && values.password == "123456"){
    //   localStorage.setItem("isloged"!, "true"); 
    //   props.handleLogin(2);
    //   alert("Login successfully!");
    // }
    // else{
    //   alert("Login failed!");
    // }
    fetch('http://192.168.80.103:5013/api/Authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.username,
        password: values.password,
        role: "string",
      })}).then(res=> res.json())
      .then(data=> {
        console.log(data);
        if(data.message!=null){
          alert("Sai tên đăng nhập hoặc mật khẩu!");
        }
        else{
          localStorage.setItem("token", data.token); 
          localStorage.setItem('fullName', data.fullName);
          window.location.reload();
        }
      });
    };
  return (
    <div className="container">
      <div className="left">
        <img className="logo" src="images/alta-logo.png" alt="ALTA Media" />

        <div className="login-card">
          <Form<FieldType>
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label={<span>Tên đăng nhập <b>*</b></span>}
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>

            <Form.Item
              label={<span>Mật khẩu <b>*</b></span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Space className="row-helper" size={0}>
              <a className="forgot-link" href="#">Quên mật khẩu?</a>
            </Space>

            <Form.Item style={{ marginTop: 8 }}>
              <Button className="btn-primary" type="primary" htmlType="submit" block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="right">
        <img className="right-image" src="images/right-image.png" alt="" />
        <div className="header">
          <p className="header1">Hệ thống</p>
          <p className="header2">QUẢN LÝ XẾP HÀNG</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
