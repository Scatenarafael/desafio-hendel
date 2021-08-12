/* eslint-disable no-eval */
import { useState, useEffect, KeyboardEvent } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { Collection } from "../../domain/models/collection";
import { ProductCollectionItem } from "../../domain/models/product.model";
import repo from "../../data/repositories/product.repository";
import { PaginationComponent } from "../layout/Pagination";
import { FiPlusSquare } from "react-icons/fi";
import { RelatedProduct } from "../../domain/models/related-product.model";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductListModalProps {
  relatedProducts?: RelatedProduct[];
  productMainId: number;
  handleClose: () => void;
}

function ProductListModal({
  relatedProducts,
  productMainId,
  handleClose,
}: ProductListModalProps) {
  const [search, setSearch] = useState("");
  const [optionPrice, setOptionPrice] = useState("=");
  const [productCollection, setProductCollection] =
    useState<Collection<ProductCollectionItem>>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    repo.getProducts(page).then(setProductCollection);
  }, [page]);

  async function handleAddRelatedProduct(relatedProductId: number) {
    if (
      !relatedProducts?.some((product) => {
        return product.id === relatedProductId;
      })
    ) {
      repo
        .addRelatedProduct(productMainId, relatedProductId)
        .then((response) => {
          toast.success("Relacionamento adicionado com sucesso!");
          handleClose();
        })
        .catch((error) => {
          toast.error(`Houve algum erro: ${error.message}`);
        });
    } else {
      toast.error("Produto já relacionado");
      // handleClose();
    }
  }

  async function handleKeypressFilterId(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!search.trim()) {
        repo.getProducts(page).then(setProductCollection);
        return;
      }
      let sample = { ...productCollection };

      let filteredData = sample.data?.filter((item) => {
        return item.id === Number(search);
      });

      const newSample = {
        currentPage: sample.currentPage ? sample.currentPage : 1,
        nextPage: sample.nextPage ? sample.nextPage : null,
        pageSize: sample.pageSize ? sample.pageSize : 20,
        prevPage: sample.prevPage ? sample.prevPage : null,
        totalPages: sample.totalPages ? sample.totalPages : 25,
        totalRowCount: sample.totalRowCount ? sample.totalRowCount : 500,
        data: filteredData ? filteredData : [],
      };

      setProductCollection(newSample);
      setSearch("");
    }
  }
  async function handleKeypressFilterName(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!search.trim()) {
        repo.getProducts(page).then(setProductCollection);
        return;
      }
      let sample = { ...productCollection };

      let filteredData = sample.data
        ?.filter((item) => {
          return item.name.includes(search);
        })
        .sort((b, c) => {
          if (b.name > c.name) {
            return 1;
          }
          if (b.name < c.name) {
            return -1;
          }
          return 0;
        });

      const newSample = {
        currentPage: sample.currentPage ? sample.currentPage : 1,
        nextPage: sample.nextPage ? sample.nextPage : null,
        pageSize: sample.pageSize ? sample.pageSize : 20,
        prevPage: sample.prevPage ? sample.prevPage : null,
        totalPages: sample.totalPages ? sample.totalPages : 25,
        totalRowCount: sample.totalRowCount ? sample.totalRowCount : 500,
        data: filteredData ? filteredData : [],
      };

      setProductCollection(newSample);
      setSearch("");
    }
  }
  async function handleKeypressFilterPrice(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!search.trim()) {
        repo.getProducts(page).then(setProductCollection);
        return;
      }
      let sample = { ...productCollection };

      let filteredData = sample.data
        ?.filter((item) => {
          return eval(`item.price ${optionPrice} ${search}`);
        })
        .sort((b, c) => {
          if (b.name > c.name) {
            return 1;
          }
          if (b.name < c.name) {
            return -1;
          }
          return 0;
        });

      const newSample = {
        currentPage: sample.currentPage ? sample.currentPage : 1,
        nextPage: sample.nextPage ? sample.nextPage : null,
        pageSize: sample.pageSize ? sample.pageSize : 20,
        prevPage: sample.prevPage ? sample.prevPage : null,
        totalPages: sample.totalPages ? sample.totalPages : 25,
        totalRowCount: sample.totalRowCount ? sample.totalRowCount : 500,
        data: filteredData ? filteredData : [],
      };

      setProductCollection(newSample);
      setSearch("");
    }
  }
  if (!productCollection) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
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
    );
  }

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Listagem de produtos</h1>
      <PaginationComponent
        totalCountOfRegisters={productCollection?.totalRowCount}
        registerPerPage={productCollection?.pageSize}
        currentPage={page}
        onPageChange={setPage}
      />
      <div className="card shadow mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%">
              <thead className="card-header py-3">
                <tr>
                  <th style={{ width: "100px" }}>ID</th>
                  <th>Nome</th>
                  <th style={{ width: "300px" }}>Preço</th>
                  <th style={{ width: "100px" }}>Relacione</th>
                </tr>
                <tr>
                  <th className="py-1">
                    <Form.Control
                      size="sm"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      onKeyDown={(e: KeyboardEvent): void => {
                        handleKeypressFilterId(e);
                      }}
                    />
                  </th>
                  <th className="py-1">
                    <Form.Control
                      size="sm"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      onKeyDown={(e: KeyboardEvent): void => {
                        handleKeypressFilterName(e);
                      }}
                    />
                  </th>
                  <th className="py-1">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <Form.Control
                          as="select"
                          size="sm"
                          onChange={(e) => {
                            setOptionPrice(
                              e.target.value === "<>" ? "!==" : e.target.value
                            );
                          }}
                        >
                          {["=", "<>", ">", ">=", "<", "<="].map(
                            (item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            )
                          )}
                        </Form.Control>
                      </InputGroup.Prepend>
                      <Form.Control
                        size="sm"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        onKeyDown={(e: KeyboardEvent): void => {
                          handleKeypressFilterPrice(e);
                        }}
                      />
                    </InputGroup>
                  </th>
                  <th className="py-1"></th>
                </tr>
              </thead>
              <tbody>
                {productCollection &&
                  productCollection.data.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>R$ {product.price.toFixed(2)}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            padding: "0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            handleAddRelatedProduct(product.id);
                          }}
                        >
                          <FiPlusSquare size="1rem" style={{ margin: "0" }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductListModal;
