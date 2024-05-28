import React, { useEffect, useState } from "react";
import { Avatar, Image, Layout, Menu, Modal } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import Logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin } from "../../redux/reducers/loginSlice";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const items = [
  { key: 2, label: "Products", route: "/products" },
  { key: 8, label: "Logout", route: "/logout" },
];

function Navbar() {
  const [isLoginLocal, setIsLoginLocal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPath = location.pathname.toLowerCase();
  const isLoginState = useSelector((state) => state.login.isLogin);
  const user = useSelector((state) => state.login.user);

  useEffect(() => {
    if (isLoginState) {
      setIsLoginLocal(isLoginState);
    }
  }, [isLoginState]);

  useEffect(() => {
    navigate(currentPath);
  }, []);

  const selectedKey = items
    .find((item) => currentPath.includes(item.label.toLowerCase()))
    ?.key.toString();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    localStorage.removeItem("accessToken");
    setIsLoginLocal(false);
    dispatch(setIsLogin(false));
    navigate("/login");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Header
      style={{
        position: "relative",
        top: 0,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        margin: "22px",
        borderRadius: "10px",
        marginBottom: 0,
        padding: 0,
      }}
    >
      <Image
        height={50}
        width={50}
        src={Logo}
        alt="logo"
        style={{ display: "flex", marginLeft: "20px" }}
      />
      <div className="demo-logo" />

      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[selectedKey]}
        style={{
          flex: 1,
          minWidth: 0,
          borderRadius: "20px",
          justifyContent: "center",
        }}
      >
        {isLoginLocal ? (
          items.map((item) =>
            item.key === 8 ? (
              <Menu.Item key={item.key} onClick={showModal}>
                {item.label}
              </Menu.Item>
            ) : (
              <Menu.Item key={item.key}>
                <Link to={item.route}>{item.label}</Link>
              </Menu.Item>
            )
          )
        ) : (
          <span className={styles.auth}>Auth</span>
        )}
      </Menu>
        {user && 
        <>
      {/* <Avatar size="small" style={{ marginLeft: "20px" }} onClick={() => setIsUserModalOpen(true)} /> */}
      <Avatar icon={<UserOutlined />} style={{marginRight: 20, cursor: 'pointer'}} onClick={() => setIsUserModalOpen(true)}/>

      <Modal title="User Details" open={isUserModalOpen} onOk={() => setIsUserModalOpen(false)} onCancel={() => setIsUserModalOpen(false)}>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role === 1 ? "Admin" : "Customer"}</p>
      </Modal></>}
      <Modal
        title="Logout Confirmation"
        open={isModalOpen}
        okText="Log out"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Are you sure you want to logout?
      </Modal>
    </Header>
  );
}

export default Navbar;
