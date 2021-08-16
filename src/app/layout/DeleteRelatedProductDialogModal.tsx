import { Button, Modal } from "react-bootstrap";
import repo from "../../data/repositories/product.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "react-query";
import { queryClient } from "../../data/config/queryClient";

interface RelatedProductModalProps {
  refresh: () => void;
  mainProductName?: string;
  mainProductId?: number;
  relatedProductName: string;
  relatedProductId: number;
  showDeleteDialogModal: boolean;
  handleCloseDeleteDialogModal: () => void;
}

export default function DeleteRelatedProductDialogModal({
  refresh,
  mainProductName = "Tomate",
  mainProductId = 0,
  relatedProductName,
  relatedProductId,
  showDeleteDialogModal,
  handleCloseDeleteDialogModal,
}: RelatedProductModalProps) {
  const removeRelatedProduct = useMutation(
    async () => {
      repo
        .removeRelatedProduct(mainProductId, relatedProductId)
        .then((response) => {
          console.log(response);
          toast.success("Relacionament excluído com sucesso");
          handleCloseDeleteDialogModal();
          refresh();
        })
        .catch((error) => {
          toast.error(`Houve algum erro na exclusão: ${error.message}`);
          refresh();
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("product");
      },
    }
  );

  async function handleDeleteRelatedProduct() {
    await removeRelatedProduct.mutateAsync();
  }
  return (
    <>
      <ToastContainer />
      <Modal
        size="lg"
        show={showDeleteDialogModal}
        onHide={handleCloseDeleteDialogModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deletar produto relacionado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Tem certeza que deseja deletar o relacionamentro entre os produtos:${mainProductName} e ${relatedProductName} ?`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteRelatedProduct}>
            Sim
          </Button>
          <Button variant="secondary" onClick={handleCloseDeleteDialogModal}>
            Não
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
