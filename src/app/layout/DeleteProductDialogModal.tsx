import { Button, Modal } from "react-bootstrap";
import repo from "../../data/repositories/product.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "react-query";
import { queryClient } from "../../data/config/queryClient";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

interface RelatedProductModalProps {
  refresh: () => void;
  mainProductName?: string;
  mainProductId?: number;
  showDeleteMainDialogModal: boolean;
  handleCloseDeleteMainDialogModal: () => void;
}

export default function DeleteProductDialogModal({
  refresh,
  mainProductName = "Tomate",
  mainProductId = 0,
  showDeleteMainDialogModal,
  handleCloseDeleteMainDialogModal,
}: RelatedProductModalProps) {
  const [showDisabledButton, setShowDisabledButton] = useState(false);
  const history = useHistory();
  const removeProduct = useMutation(
    async () => {
      repo
        .deleteProduct(mainProductId)
        .then(() => {
          handleCloseDeleteMainDialogModal();
          history.push("/");
        })
        .catch((error) => {
          toast.error(`Houve algum erro na exclusão: ${error.message}`);
          handleCloseDeleteMainDialogModal();
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
      },
    }
  );
  useEffect(() => {
    if (removeProduct.isLoading) {
      setShowDisabledButton(true);
    } else {
      setShowDisabledButton(false);
    }
  }, [removeProduct]);

  async function handleDeleteProduct() {
    await removeProduct.mutateAsync();
  }
  return (
    <>
      <ToastContainer />
      <Modal
        size="lg"
        show={showDeleteMainDialogModal}
        onHide={handleCloseDeleteMainDialogModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deletar produto relacionado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Tem certeza que deseja deletar o produto ${mainProductName}?`}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleDeleteProduct}
            disabled={showDisabledButton}
          >
            Sim
          </Button>
          <Button
            variant="secondary"
            onClick={handleCloseDeleteMainDialogModal}
          >
            Não
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
