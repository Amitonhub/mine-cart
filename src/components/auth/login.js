import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import styles from "./auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api";
import { batch, useDispatch } from "react-redux";
import { setIsLogin, setUserDetails } from "../../redux/reducers/loginSlice";

const Login = () => { 
  const [loginUser, { isLoading, isError, isSuccess, data }] = useLoginMutation();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (isSuccess && data) {
      localStorage.setItem('accessToken', data.accessToken);
      batch(() => {
        dispatch(setUserDetails(data?.user))
        dispatch(setIsLogin(true))
      })
      navigate('/products');
    }
  }, [isSuccess, data]);

  const onFinish = async (values) => {
    try {
      await loginUser({email: values.email, password: values.password }).unwrap();
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  return (
  <div className={styles.formContainer}>
    <h1 className={styles.heading}>Login</h1>
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button className={styles.button} type="primary" htmlType="submit" disabled={isLoading}>
            Login
          </Button>
        </Form.Item>
        {isError && <h4 style={{color: 'red'}}>Please check your email or password!</h4>}
        <p>
          Don't have an account?{" "}
          <Link to="/">
            <Button type="dashed">Register here</Button>
          </Link>
        </p>
      </Form>
    </div>
  </div>
)}

export default Login;
