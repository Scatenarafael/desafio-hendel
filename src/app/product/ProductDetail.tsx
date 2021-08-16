import { useState } from "react";
import { Button, Card, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import repo from "../../data/repositories/product.repository";
import { Product } from "../../domain/models/product.model";
import { FiDelete, FiPlusSquare } from "react-icons/fi";
import RelatedProductModal from "../layout/RelatedProductModal";
import DeleteRelatedProductDialogModal from "../layout/DeleteRelatedProductDialogModal";
import { useQuery } from "react-query";
import ErrorPage from "../layout/ErrorPage";
import DeleteProductDialogModal from "../layout/DeleteProductDialogModal";

interface ProductParams {
  id: string;
}

function ProductDetail() {
  const params = useParams<ProductParams>();
  const [productData, setProductData] = useState<Product>();
  const [relatedProductName, setRelatedProductName] = useState<string>("");
  const [relatedProductId, setRelatedProductId] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [showDeleteDialogModal, setShowDeleteDialogModal] =
    useState<boolean>(false);
  const [showDeleteMainDialogModal, setShowDeleteMainDialogModal] =
    useState<boolean>(false);

  const { isLoading, error, refetch } = useQuery(
    ["product", params.id],
    async () => {
      const data = await repo.getProduct(Number(params.id));
      setProductData(data);
      return data;
    }
  );

  const handleCloseDeleteDialogModal = () => {
    setShowDeleteDialogModal(false);
  };
  const handleCloseMainDeleteDialogModal = () => {
    setShowDeleteMainDialogModal(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    handleRefresh();
  };
  function handleRefresh() {
    refetch({ throwOnError: false, cancelRefetch: true });
  }

  return (
    <>
      <Card style={{ width: "100%", height: "100vh" }}>
        {isLoading ? (
          <div
            style={{
              width: "100%",
              height: "700px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "4rem", marginBottom: " 8rem" }}>
              Carregando...
            </span>
            <Spinner
              animation="border"
              variant="primary"
              style={{ width: "10rem", height: "10rem" }}
            />
          </div>
        ) : error ? (
          <ErrorPage />
        ) : (
          productData && (
            <>
              <Card.Title
                style={{
                  fontSize: "3rem",
                  marginTop: "1rem",
                  marginLeft: "1rem",
                  display: "flex",
                }}
              >
                {productData?.name}
                <Card.Text style={{ marginLeft: "auto", marginRight: "1rem" }}>
                  R${productData?.price}
                </Card.Text>
              </Card.Title>
              <Card.Subtitle
                className="mb-2 text-muted"
                style={{
                  marginLeft: "1rem",
                  marginRight: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {new Date(productData?.updatedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                <div>
                  <Button>Alterar</Button>
                  <Button
                    variant="danger"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => {
                      setShowDeleteMainDialogModal(true);
                    }}
                  >
                    Deletar
                  </Button>
                </div>
              </Card.Subtitle>
              <Card.Body
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Card.Text style={{ fontSize: "2rem" }}>
                  {productData?.description}
                </Card.Text>

                <div
                  className="card shadow mb-4"
                  style={{ height: "50vh", overflowY: "scroll" }}
                >
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <Table responsive>
                        <thead className="card-header py-3">
                          <tr>
                            <th style={{ width: "120px" }}>ID</th>
                            <th>Nome</th>
                            <th style={{ width: "200px" }}>Preço</th>
                            <th style={{ width: "2rem", textAlign: "right" }}>
                              <Button
                                style={{
                                  width: "2.2rem",
                                  padding: "0",
                                }}
                                onClick={handleShow}
                              >
                                <FiPlusSquare size="2rem" />
                              </Button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData &&
                            productData.relatedProducts.map((product) => (
                              <tr key={product.id}>
                                <td style={{ textAlign: "center" }}>
                                  {product.id}
                                </td>
                                <td>
                                  <Link to={`${product.id}`}>
                                    {product.name}
                                  </Link>
                                </td>
                                <td>R$ {product.price.toFixed(2)}</td>
                                <td>
                                  <Button
                                    variant="danger"
                                    style={{
                                      width: "2rem",
                                      height: "1.5rem",
                                      padding: "0",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onClick={() => {
                                      setRelatedProductName(product.name);
                                      setRelatedProductId(product.id);
                                      setShowDeleteDialogModal(true);
                                    }}
                                  >
                                    <FiDelete size="1rem" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </>
          )
        )}
      </Card>
      <RelatedProductModal
        relatedProducts={productData?.relatedProducts}
        productMainId={productData?.id}
        productMainName={productData?.name}
        show={show}
        handleClose={handleClose}
      />
      <DeleteRelatedProductDialogModal
        refresh={handleRefresh}
        mainProductName={productData?.name}
        mainProductId={productData?.id}
        relatedProductName={relatedProductName}
        relatedProductId={relatedProductId}
        showDeleteDialogModal={showDeleteDialogModal}
        handleCloseDeleteDialogModal={handleCloseDeleteDialogModal}
      />
      <DeleteProductDialogModal
        refresh={handleRefresh}
        mainProductName={productData?.name}
        mainProductId={productData?.id}
        showDeleteMainDialogModal={showDeleteMainDialogModal}
        handleCloseDeleteMainDialogModal={handleCloseMainDeleteDialogModal}
      />
    </>
  );
}

export default ProductDetail;
