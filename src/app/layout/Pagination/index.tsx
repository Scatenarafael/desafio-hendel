import React from "react";
import { Pagination, Container, Col, Row } from "react-bootstrap";

interface PaginationProps {
  totalCountOfRegisters?: number;
  registerPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter((page) => page > 0);
}

export function PaginationComponent({
  totalCountOfRegisters = 500,
  registerPerPage = 20,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registerPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - (siblingsCount + 1), currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : [];

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Pagination>
            {currentPage > 1 + siblingsCount && (
              <>
                <Pagination.Item
                  onClick={() => {
                    onPageChange(1);
                  }}
                >
                  {1}
                </Pagination.Item>
                <Pagination.Ellipsis
                  onClick={() => {
                    onPageChange(currentPage - siblingsCount - 1);
                  }}
                />
              </>
            )}
            {previousPages.length > 0 &&
              previousPages.map((page) => {
                return (
                  <Pagination.Item
                    key={page}
                    onClick={() => {
                      onPageChange(page);
                    }}
                  >
                    {page}
                  </Pagination.Item>
                );
              })}

            <Pagination.Item active>{currentPage}</Pagination.Item>

            {nextPages.length > 0 &&
              nextPages.map((page) => {
                return (
                  <Pagination.Item
                    key={page}
                    onClick={() => {
                      onPageChange(page);
                    }}
                  >
                    {page}
                  </Pagination.Item>
                );
              })}

            {currentPage + siblingsCount < lastPage && (
              <>
                {currentPage + siblingsCount + 1 < lastPage && (
                  <>
                    <Pagination.Ellipsis
                      onClick={() => {
                        onPageChange(currentPage + siblingsCount + 1);
                      }}
                    />
                  </>
                )}
                <Pagination.Item
                  onClick={() => {
                    onPageChange(lastPage);
                  }}
                >
                  {lastPage}
                </Pagination.Item>
              </>
            )}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}
