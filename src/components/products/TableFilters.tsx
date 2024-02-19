import { FC } from "react";
import { SubmitHandler } from "react-hook-form";
import { InputText } from "../customs/InputText";
import { Button } from "../customs/Button";
import { IProduct, IProductsFilter } from "../../interfaces";
import { useDispatch } from "react-redux";
import { setFiltersProducts } from "../../store/slices/filtersSlice";

interface Props {
  methods: any;
}

export const TableFilters: FC<Props> = ({ methods }) => {
  const dispatch = useDispatch();
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<IProduct> = (data) => {
    const newObj: IProductsFilter = {
      product: data.product,
      price: String(data.price),
    };
    dispatch(setFiltersProducts(newObj));
  };

  const handleResetFilter = () => {
    reset();
    dispatch(setFiltersProducts({ product: "", price: "", typeUnit: "" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-grey-50 rounded">
        <div className="flex justify-between py-4 px-3">
          <div className="flex w-full gap-x-8 pr-4">
            <div className="w-1/2">
              <InputText
                placeholder="Buscar por producto"
                type="text"
                className=""
                name="product"
              />
            </div>
            <div className="w-1/2">
              <InputText
                placeholder="Buscar por precio"
                type="text"
                name="price"
                className=""
              />
            </div>
          </div>
          <div className="flex gap-x-4">
            <Button
              color=""
              className="bg-[#818181]"
              height="45px"
              legend="Limpiar filtros"
              size="xl"
              weight="normal"
              width="140px"
              onClick={handleResetFilter}
            />
            <Button
              color="blue"
              height="45px"
              legend="Buscar"
              size="xl"
              weight="normal"
              width="140px"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
