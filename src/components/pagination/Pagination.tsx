import BPagination from "react-bootstrap/Pagination";
import "./pagination.css";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  totalItems: number;
  currentPage: number;
  onChangePage: (n: number) => void;
  filasPorPaginas?: number;
}

export const Pagination = ({
  totalItems,
  currentPage,
  filasPorPaginas = 10,
  onChangePage,
}: Props) => {
  const ultimaPagina = Math.ceil(totalItems / filasPorPaginas);
  const isMobile = useIsMobile(768);

  // Simplified pagination for mobile
  if (isMobile) {
    return (
      <BPagination className="pagination-mobile">
        {currentPage > 1 && (
          <BPagination.Item
            onClick={() => onChangePage(currentPage - 1)}
          >
            Anterior
          </BPagination.Item>
        )}
        
        <BPagination.Item active>{currentPage}</BPagination.Item>
        
        {currentPage < ultimaPagina && (
          <BPagination.Item
            onClick={() => onChangePage(currentPage + 1)}
          >
            Siguiente
          </BPagination.Item>
        )}
      </BPagination>
    );
  }

  // Desktop pagination with more options
  return (
    <BPagination>
      {currentPage > 1 && (
        <BPagination.Item
          onClick={() => currentPage > 1 && onChangePage(currentPage - 1)}
        >
          Anterior
        </BPagination.Item>
      )}
      {currentPage > 2 && (
        <BPagination.Item onClick={() => currentPage > 1 && onChangePage(1)}>
          {1}
        </BPagination.Item>
      )}
      {currentPage >= 4 && <BPagination.Ellipsis />}

      {currentPage > 1 && (
        <BPagination.Item onClick={() => onChangePage(currentPage - 1)}>
          {currentPage - 1}
        </BPagination.Item>
      )}
      <BPagination.Item active>{currentPage} </BPagination.Item>
      {currentPage < ultimaPagina && (
        <BPagination.Item onClick={() => onChangePage(currentPage + 1)}>
          {currentPage + 1}
        </BPagination.Item>
      )}

      {currentPage < ultimaPagina - 2 && <BPagination.Ellipsis />}
      {currentPage < ultimaPagina - 1 && (
        <BPagination.Item onClick={() => onChangePage(ultimaPagina)}>
          {ultimaPagina}
        </BPagination.Item>
      )}
      {currentPage < ultimaPagina && (
        <BPagination.Item
          onClick={() =>
            currentPage < ultimaPagina && onChangePage(currentPage + 1)
          }
        >
          Siguiente
        </BPagination.Item>
      )}
    </BPagination>
  );
};
