import { Button, Modal } from "react-bootstrap";
import repo from "../../data/repositories/product.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RelatedProductModalProps {
  mainProductName: string;
  mainProductId: number;
  relatedProductName: string;
  relatedProductId: number;
  showDeleteDialogModal: boolean;
  handleCloseDeleteDialogModal: () => void;
}

export default function DeleteRelatedProductDialogModal({
  mainProductName,
  mainProductId,
  relatedProductName,
  relatedProductId,
  showDeleteDialogModal,
  handleCloseDeleteDialogModal,
}: RelatedProductModalProps) {
  async function handleDeleteRelatedProduct() {
    repo
      .removeRelatedProduct(mainProductId, relatedProductId)
      .then((response) => {
        console.log(response);
        toast.success("Relacionament excluído com sucesso");
        handleCloseDeleteDialogModal();
      })
      .catch((error) => {
        toast.error(`Houve algum erro na exclusão: ${error.message}`);
      });
  }
  return (
    <>
      <ToastContainer />
      <Modal
        size="sm"
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
