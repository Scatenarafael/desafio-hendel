/* eslint-disable no-eval */
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import repo from "../../data/repositories/product.repository";
import { queryClient } from "../../data/config/queryClient";
import { useState } from "react";
import { Formik } from "formik";

type CreateProductFormData = {
  name: string;
  description: string;
  price: number;
  quantity: number;
};

const schema = yup.object().shape({
  name: yup.string().required("Nomeie o produto"),
  description: yup.string().required("Descrição necessária"),
  price: yup.number().required("Entre com o Preço do produto"),
  quantity: yup.number().required("Entre com a Quantity do produto"),
});

function CreateProduct() {
  const history = useHistory();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  const createProduct = useMutation(
    async (product: CreateProductFormData) => {
      console.log("sucesso");
      const response = await repo.createProduct(product);
      console.log(response);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
      },
    }
  );

  const handleCreateProduct = async (product: CreateProductFormData) => {
    await createProduct.mutateAsync(product);

    history.push("/");
  };

  return (
    <div>
      <h1>Crie um novo produto</h1>
      <div className="card shadow mb-4">
        <div className="card-body p-3 p-0">
          <Formik
            validationSchema={schema}
            onSubmit={(e) => {
              const product = {
                name: e.name,
                description: e.description,
                price: Number(e.price),
                quantity: Number(e.quantity),
              };
              handleCreateProduct(product);
            }}
            initialValues={{
              name: "",
              description: "",
              price: "",
              quantity: "",
            }}
          >
            {({ handleSubmit, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="8" controlId="validationFormikname">
                    <Form.Label>Nome</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        aria-describedby="inputGroupPrepend"
                        name="name"
                        value={productName}
                        onChange={(e) => {
                          values.name = e.target.value;
                          setProductName(e.target.value);
                        }}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationFormik04">
                    <Form.Label>Preço</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      value={productPrice}
                      onChange={(e) => {
                        values.price = e.target.value.replace(",", ".");
                        setProductPrice(e.target.value.replace(",", "."));
                      }}
                      isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="8" controlId="validationFormik03">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={productDescription}
                      onChange={(e) => {
                        values.description = e.target.value;
                        setProductDescription(e.target.value);
                      }}
                      isInvalid={!!errors.description}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationFormik05">
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="quantity"
                      value={productQuantity}
                      onChange={(e) => {
                        values.quantity = e.target.value.replace(",", ".");
                        setProductQuantity(e.target.value.replace(",", "."));
                      }}
                      isInvalid={!!errors.quantity}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.quantity}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Button type="submit">Submit form</Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
