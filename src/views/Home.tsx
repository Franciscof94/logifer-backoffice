import { Link } from "react-router-dom";
import { Button } from "../components/customs/Button";

export const Home = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-center py-14 text-5xl font-semibold">
          Bienvenido al backoffice de Logifer
        </h1>
        <div>
          <Link to="/nuevo-pedido">
            <Button
              color="blue"
              height="40px"
              legend="Crear nuevo pedido"
              size="xl"
              weight=""
              width="250px"
            />
          </Link>
        </div>
        <div className="py-8">
          <Link to="/nuevo-cliente">
            <Button
              color="blue"
              height="40px"
              legend="Crear nuevo cliente"
              size="xl"
              weight=""
              width="250px"
            />
          </Link>
        </div>
        <div>
          <Link to="/nuevo-producto">
            <Button
              color="blue"
              height="40px"
              legend="Crear nuevo producto"
              size="xl"
              weight=""
              width="250px"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
