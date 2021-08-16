import { Button, Modal } from "react-bootstrap";
import { RelatedProduct } from "../../domain/models/related-product.model";
import ProductListModal from "../product/ProductListModal";

interface RelatedProductModalProps {
  productMainId?: number;
  productMainName?: string;
  show: boolean;
  handleClose: () => void;
  relatedProducts?: RelatedProduct[];
}

export default function RelatedProductModal({
  relatedProducts,
  productMainId = 0,
  productMainName = "Tomate",
  show,
  handleClose,
}: RelatedProductModalProps) {
  return (
    <>
      <Modal size="xl" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{`Escolha o Produto que deseja relacionar ao Produto principal: ${productMainName}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductListModal
            relatedProducts={relatedProducts}
            productMainId={productMainId}
            handleClose={handleClose}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
