import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "../components/customs/Button";
import { InputText } from "../components/customs/InputText";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserSchema } from "../validationSchemas";
import { IUser } from "../interfaces";
import { AxiosError } from "axios";
import AuthService from "../services/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalLoginError } from "../components/auth/ModalLoginError";

export const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[error, setError] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm<IUser>({
    resolver: yupResolver(UserSchema),
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const auth = useSelector((state: any) => state.authData.auth);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  console.log(auth)

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/nuevo-pedido", { replace: true });
    }
  }, [navigate, auth]);

  const onSubmit: SubmitHandler<IUser> = async (data) => {
    try {
      const res = await AuthService.postLogin(data);

      const { accessToken, refreshToken, user } = res;
      Cookies.set("token", JSON.stringify({ accessToken, refreshToken }));

      dispatch(login({ accessToken, user, refreshToken }));
    } catch (error: Error | AxiosError | any) {
      openModal();
      setError(error.message)
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1 flex bg-grey align-center justify-center">
          <div className="w-[365px] mt-16">
            <h1 className="text-4xl font-medium text-black text-center py-11">
              Ingresar
            </h1>
            <div className="grid mb-9">
              <label className="text-xl mb-1">Email</label>
              <InputText placeholder="Email" type="email" name="email" />
            </div>
            <div className="grid">
              <label className="text-xl mb-1">Contraseña</label>
              <InputText
                placeholder="Contraseña"
                type="password"
                name="password"
              />
            </div>

            <div className="my-12">
              <Button
                legend="Ingresar"
                width="365px"
                size="xl"
                color="blue"
                height="45px"
                weight="font-light"
              />
            </div>
          </div>
        </div>
      </form>
      <ModalLoginError closeModal={closeModal} modalIsOpen={modalIsOpen} message={error} />
    </FormProvider>
  );
};
