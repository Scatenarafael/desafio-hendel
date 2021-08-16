import { Button, Modal } from "react-bootstrap";
import repo from "../../data/repositories/product.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "react-query";
import { queryClient } from "../../data/config/queryClient";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
  const removeProduct = useMutation(
    async () => {
      repo
        .deleteProduct(mainProductId)
        .then((response) => {
          console.log(response);
          toast.success("Produto excluído com sucesso");
          handleCloseDeleteMainDialogModal();
          history.push("/");
          refresh();
        })
        .catch((error) => {
          toast.error(`Houve algum erro na exclusão: ${error.message}`);
          handleCloseDeleteMainDialogModal();
          refresh();
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("product");
      },
    }
  );

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
          <Button variant="danger" onClick={handleDeleteProduct}>
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
