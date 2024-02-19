import { InputText } from "../customs/InputText";

export const FormEditProduct = () => {
  return (
    <div className="px-16 mt-3 mb-5">
      <div className="flex mt-8 gap-x-16">
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Nombre del producto</label>
          <InputText
            placeholder="Nombre del producto"
            type="text"
            color="bg-grey"
            name="product"
          />
        </div>
      </div>
      <div className="flex mt-8 gap-x-16">
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Precio</label>
          <InputText
            placeholder="Precio"
            type="text"
            color="bg-grey"
            name="price"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Stock</label>
          <InputText
            placeholder="Stock"
            type="text"
            color="bg-grey"
            name="stock"
          />
        </div>
      </div>
    </div>
  );
};
