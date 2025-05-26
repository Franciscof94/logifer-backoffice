import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "../components/customs/Button";
import { InputText } from "../components/customs/InputText";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserSchema } from "../validationSchemas";
import { IUser } from "../interfaces";
import AuthService from "../services/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalLoginError } from "../components/auth/ModalLoginError";
import { setLoadingButton } from "../store/slices/uiSlice";
import { RootState } from "@/store/store";

export const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm<IUser>({
    resolver: yupResolver(UserSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const auth = useSelector((state: RootState) => state.authData.auth);

  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/", { replace: true });
    }
  }, [navigate, auth]);

  const onSubmit: SubmitHandler<IUser> = async (data) => {
    try {
      dispatch(setLoadingButton(true));
      const res = await AuthService.postLogin(data);
      dispatch(setLoadingButton(false));

      console.log("Respuesta del login:", res);
      const {
        data: { access_token, refreshToken, user },
      } = res;

      console.log("ress", res.data.accessToken);

      Cookies.set("token", access_token, { expires: 7 });

      dispatch(
        login({
          accessToken: access_token,
          refreshToken,
          user: user || { id: 1, name: "Usuario" },
        })
      );

      setTimeout(() => {
        console.log("Login exitoso, redirigiendo a home...");
        navigate("/", { replace: true });
      }, 500);
    } catch (error: any) {
      console.error("Error en login:", error);
      dispatch(setLoadingButton(false));
      openModal();
      setError(error.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1 flex bg-grey align-center h-screen justify-center">
          <div className="w-[365px]">
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
                isLoading={isLoadingButton}
                disabled={isLoadingButton}
                color="blue"
                height="45px"
                weight="font-light"
              />
            </div>
          </div>
        </div>
      </form>
      <ModalLoginError
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        message={error}
      />
    </FormProvider>
  );
};
