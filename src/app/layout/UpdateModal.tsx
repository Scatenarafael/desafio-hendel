import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import repo from "../../data/repositories/product.repository";
import { queryClient } from "../../data/config/queryClient";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UpdateProps {
  id: number;
  attributes: Record<string, any>;
}

interface UpdateModalProps {
  refresh: () => void;
  productid: number;
  label: string;
  field: string;
  data: string | number;
  showUpdateModal: boolean;
  handleCloseUpdateModal: () => void;
}
interface ObjProps {
  [key: string]: any;
}

export default function UpdateModal({
  refresh,
  productid,
  label,
  field,
  data,
  showUpdateModal,
  handleCloseUpdateModal,
}: UpdateModalProps) {
  const [dataToUpdate, setDataToUpdate] = useState(
    typeof data === "string" ? "" : 0
  );

  useEffect(() => {
    setDataToUpdate(data);
  }, [data]);

  const updateProduct = useMutation(
    async ({ id, attributes }: UpdateProps) => {
      repo
        .updateProduct(id, attributes)
        .then((response) => {
          toast.success("Produto atualizado com sucesso!");
          handleCloseUpdateModal();
          refresh();
          return response;
        })
        .catch((error) => {
          toast.error(`Houve algum Problema: ${error.message}`);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
      },
    }
  );

  const handleUpdateProduct = async ({ id, attributes }: UpdateProps) => {
    try {
      await updateProduct.mutateAsync({ id, attributes });
    } catch (err) {
      toast.error(`Houve algum Problema: ${err.message}`);
      return;
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal size="lg" show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Realizar o Update do produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div>
              <h1>Atualize o campo:</h1>
              <div className="card shadow mb-4">
                <div className="card-body p-3 p-0">
                  <Formik
                    onSubmit={(e) => {
                      const updatedData = {
                        data:
                          typeof data === "string" ? e.data : Number(e.data),
                      };
                      let obj: ObjProps = {};

                      obj[field] = updatedData.data;

                      console.log(obj);

                      handleUpdateProduct({
                        id: productid,
                        attributes: obj,
                      });
                    }}
                    initialValues={{
                      data: "",
                    }}
                  >
                    {({ handleSubmit, values }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="12"
                            controlId="validationFormik04"
                          >
                            <Form.Label>{label}</Form.Label>
                            <Form.Control
                              type="text"
                              name={field}
                              value={dataToUpdate}
                              onChange={(e) => {
                                values.data = e.target.value.replace(",", ".");
                                setDataToUpdate(
                                  e.target.value.replace(",", ".")
                                );
                              }}
                            />
                          </Form.Group>
                        </Row>
                        <Button type="submit">Enviar</Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
