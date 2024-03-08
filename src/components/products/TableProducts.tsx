import React, {
  CSSProperties,
  ChangeEvent,
  FC,
  useEffect,
  useState,
} from "react";
import { BiSolidEdit } from "react-icons/bi";
import { Pagination } from "../pagination/Pagination";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
import { EditProductModal as OrdersEditProductModal } from "../orders/EditProductModal";
import { IProduct } from "../../interfaces";
import { IPagination } from "../../interfaces/Pagination.interface";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import ProductsService from "../../services/products/productsService";
import { toast } from "react-toastify";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { AxiosError } from "axios";

interface Props {
  products: IProduct[] | undefined;
  pagination: IPagination | undefined;
  refreshTable: (page?: number | undefined, rows?: number | undefined) => void;
}

const override: CSSProperties = {
  display: "block",
  margin: "3px auto",
  borderColor: "#3342B1",
};

const columns = ["Producto", "Precio", "Stock", "Acción"];

export const TableProducts: FC<Props> = ({
  products,
  pagination,
  refreshTable,
}) => {
  const dispatch = useDispatch();
  const [tableProducts, setTableProducts] = useState<IProduct[]>();
  const [modalDeleteIsOpen, setIsOpenModalDelete] = useState(false);
  const [modalEditIsOpen, setIsOpenModalEdit] = useState(false);
  const [productSelected, setProductSelected] = useState<IProduct>();
  const [isOpenModalEditStock, setIsOpenModalEditStock] = useState(false);
  const [updatedCount, setUpdatedCount] = useState<number | null | undefined>(
    null
  );

  const { loadingTableOrders } = useSelector((state: any) => state.ordersData);

  /*   const openModalDelete = (row: IProduct) => {
    setIsOpenModalDelete(true);
    setProductSelected(row);
  }; */

  const closeModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const openModalEdit = (row: IProduct) => {
    setIsOpenModalEdit(true);
    setProductSelected(row);
  };

  const closeModalEdit = () => {
    setIsOpenModalEdit(false);
  };

  const openModalEditStock = (row: IProduct) => {
    setProductSelected(row);
    setIsOpenModalEditStock(true);
  };

  const closeModalEditStock = () => {
    setIsOpenModalEditStock(false);
  };

  const handleDelete = async () => {
    try {
      await ProductsService.deleteProduct(productSelected?.id);

      toast.error("Cliente eliminado correctamente");
      refreshTable();
      closeModalDelete();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      setTableProducts((prevState: IProduct[] | undefined) => {
        return prevState?.map((ctProduct) => {
          if (ctProduct.id === productSelected?.id) {
            return {
              ...ctProduct,
              count: updatedCount || 0,
            };
          }
          return ctProduct;
        });
      });
      dispatch(setLoadingButton(true));
      await ProductsService.editProductStock(productSelected?.id, updatedCount);
      dispatch(setLoadingButton(false));
      toast.success("Stock actualizado exitosamente!");
      refreshTable();
      closeModalEditStock();
    } catch (error: Error | AxiosError | any) {
      dispatch(setLoadingButton(false));
      toast.error(error.message);
    }
  };

  /*  const handleMinus = () => {
    const newCount = (updatedCount || 0) - 1;
    setUpdatedCount(newCount >= 1 ? newCount : 1);
  };

  const handlePlus = () => {
    if (!updatedCount) {
      setUpdatedCount(1);
    } else {
      const newCount = updatedCount + 1;
      setUpdatedCount(newCount);
    }
  }; */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setUpdatedCount(Number(value));
    }
  };

  useEffect(() => {
    setTableProducts(products);
  }, [products]);

  useEffect(() => {
    setUpdatedCount(productSelected?.stock);
  }, [productSelected?.stock, isOpenModalEditStock]);

  return (
    <div className="">
      <div className=" max-h-[380px]">
        <div className="rounded-[5px] shadow-lg">
          <table className="w-full rounded-sm overflow-hidden">
            <thead className="bg-grey-50 h-11">
              <tr>
                {columns.map((col, i) => {
                  const textAlignClass =
                    i === columns.length - 1 ? "text-end" : "text-start";
                  return (
                    <th
                      key={col}
                      className={`text-white font-semibold px-4 ${textAlignClass}`}
                    >
                      {col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loadingTableOrders ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center font-normal text-xl text-black py-2"
                  >
                    <ClipLoader
                      color={"#3342B1"}
                      loading={loadingTableOrders}
                      cssOverride={override}
                      size={35}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </td>
                </tr>
              ) : tableProducts?.length ? (
                tableProducts?.map((row, rowIndex: number) => (
                  <React.Fragment key={rowIndex}>
                    <>
                      <tr
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? "" : "bg-grey"}
                      >
                        <td key={rowIndex} className="text-grey-70 px-4 py-2">
                          {row.product}
                        </td>
                        <td key={rowIndex} className="text-grey-70 px-4 py-2">
                          ${row.price}
                        </td>

                        <td key={rowIndex} className="text-grey-70 px-8 py-2 ">
                          <div className="flex max-w-[290px]">
                            <div className="flex justify-center min-w-7">
                              {" "}
                              {row.stock}
                            </div>
                            <div
                              className="px-4"
                              onClick={() => {
                                openModalEditStock(row);
                              }}
                            >
                              <BiSolidEdit className="cursor-pointer" />
                            </div>
                            <div>
                              {row.stock === 0 && (
                                <small className="px-3 text-danger font-medium">
                                  {" "}
                                  No hay stock{" "}
                                </small>
                              )}

                              {row.stock < 10 && row.stock > 0 && (
                                <small className="px-3 text-orange font-medium">
                                  Queda poco stock{" "}
                                </small>
                              )}

                              {row.stock > 10 && (
                                <small className="px-3 text-green font-medium">
                                  Hay stock
                                </small>
                              )}
                            </div>
                          </div>
                        </td>

                        <td
                          key={rowIndex}
                          className="text-grey-70 px-4 flex justify-end py-2"
                        >
                          <div className="flex items-center">
                            <div
                              className="px-4"
                              onClick={() => {
                                openModalEdit(row);
                              }}
                            >
                              <BiSolidEdit className="cursor-pointer" />
                            </div>
                            {/*  <div>
                              <TiDelete
                                color="#F44336"
                                size={24}
                                className="cursor-pointer "
                                onClick={() => {
                                  openModalDelete(row);
                                }}
                              />
                            </div> */}
                          </div>
                        </td>
                      </tr>
                    </>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center font-normal text-xl text-black py-2"
                  >
                    No hay productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>{" "}
      <div className="flex justify-end mt-12">
        <Pagination
          currentPage={pagination?.page ?? 0}
          onChangePage={() => {}}
          totalItems={pagination?.totalElements ?? 0}
          filasPorPaginas={pagination?.size}
        />
      </div>
      <DeleteProductModal
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        product={productSelected}
        handleDelete={handleDelete}
      />
      <EditProductModal
        closeModal={closeModalEdit}
        modalIsOpen={modalEditIsOpen}
        product={productSelected}
        handleEdit={handleEdit}
        refreshTable={refreshTable}
      />
      <OrdersEditProductModal
        closeModal={closeModalEditStock}
        modalIsOpen={isOpenModalEditStock}
        product={productSelected?.product}
        handleEdit={handleEdit}
        handleChange={handleChange}
        count={updatedCount}
        title="stock"
      />
    </div>
  );
};
