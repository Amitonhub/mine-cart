import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Modal, Input, Upload } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "../redux/api";
import dummyProduct from "../assets/dummy-product.png";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate()
  const [modal2Open, setModal2Open] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const { data: products, error, isLoading } = useGetAllProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [addProduct] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const user = useSelector((state) => state.login.user);
  const isMobile = window.innerWidth < 767;

  const handleAddToCart = (product) => {
    const updatedCartItems = [...cartItems, product];
    setCartItems(updatedCartItems);
  };
  console.log(cartItems)
  const totalItemsInCart = cartItems.length;


  useEffect(() => {
    if(!user){
      navigate('/login')
    }else{
      navigate('/products')
    }
  },[user])

  const handleAddProduct = async () => {
    try {
      await addProduct(updatedProduct).unwrap();
      setModal2Open(false);
      toast.success('product added successfully!')
    } catch (err) {
      // handle error, e.g., show an error message
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct({productId: id}).unwrap();
      setModal2Open(false);
      toast.success('product deleted successfully!')
    } catch (err) {
      // handle error, e.g., show an error message
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setUpdatedProduct({
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setModal2Open(true);
  };

  const handleUpdateProduct = async () => {
    try {
      await updateProduct({
        productId: editProduct._id,
        updatedProduct,
      }).unwrap();
      setEditProduct(null);
      setUpdatedProduct({ name: "", price: "", image: "" });
      setModal2Open(false);
      toast.success("Product updated successfully");
    } catch (err) {
      // handle error, e.g., show an error message
      console.error("Error updating product:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div
      style={{
        padding: "20px",
        display: isMobile && "flex",
        flexDirection: isMobile && "column",
      }}
    >
      {/* Add Product Button */}
      {Number(user?.role) === 1 ? (
        <Button
          type="dashed"
          style={{
            backgroundColor: "#8251FE",
            color: "white",
            float: !isMobile && "right",
            marginBottom: "20px",
          }}
          onClick={() => setModal2Open(true)}
        >
          Add Product
        </Button>
      ) : (
        <Button
          type="dashed"
          style={{
            backgroundColor: "#8251FE",
            color: "white",
            float: !isMobile && "right",
            marginBottom: "20px",
          }}
          onClick={() => {toast.warn('Payment Integration needed!')}}
        >
          Cart ({totalItemsInCart})
        </Button>
      )}

      {/* Product Edit Modal */}
      <Modal
        title={editProduct ? "Edit Product" : "Add New Product"}
        okText="Save"
        centered
        visible={modal2Open}
        onOk={editProduct ? handleUpdateProduct : handleAddProduct}
        onCancel={() => {
          setEditProduct(null);
          setUpdatedProduct({ name: "", price: "", image: "" });
          setModal2Open(false);
        }}
      >
        <Input
          style={{ margin: "10px 0" }}
          placeholder="Product Name"
          value={updatedProduct.name}
          onChange={(e) =>
            setUpdatedProduct({ ...updatedProduct, name: e.target.value })
          }
        />
        <Input
          placeholder="Price"
          value={updatedProduct.price}
          style={{ margin: "10px 0" }}
          onChange={(e) =>
            setUpdatedProduct({ ...updatedProduct, price: e.target.value })
          }
        />
        <Upload
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              setUpdatedProduct({ ...updatedProduct, image: reader.result });
            };
            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {updatedProduct.image && (
          <img
            src={updatedProduct.image}
            alt="Preview"
            style={{ marginTop: 10, maxWidth: 200 }}
          />
        )}
      </Modal>

      {/* Product Cards */}
      <Row gutter={[16, 16]}>
        {products.map((product, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
              hoverable
              style={{ width: !isMobile && 200 }}
              cover={
                <img alt={product.name} src={product?.image || dummyProduct} />
              }
            >
              <Card.Meta
                style={{ margin: 0, marginTop: 10 }}
                title={product.name}
                description={`Price: ${product.price}`}
              />
              {Number(user?.role) === 1 ? (
                <Button
                  type="primary"
                  style={{ backgroundColor: "#8251FE", marginTop: "10px" }}
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  type="primary"
                  style={{ backgroundColor: "#8251FE", marginTop: "10px" }}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </Button>
              )}
              {Number(user?.role) === 1 &&
              <DeleteOutlined style={{marginLeft: 25}} name="delete" onClick={(() => {handleDeleteProduct(product._id)})}/>}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products;
