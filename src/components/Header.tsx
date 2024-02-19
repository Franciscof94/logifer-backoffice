import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { JwtPayload, jwtDecode } from "jwt-decode";

import { Logo } from "../assets";
import { RxHamburgerMenu } from "react-icons/rx";
import { setShowNavbar } from "../store/slices/navbarSlice";
import { login } from "../store/slices/authSlice";
import { useEffect } from "react";

export const Header = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.authData.auth);
  const isLogged = auth?.user;

  useEffect(() => {
    const cookies = Cookies.get("token");
    console.log(cookies);
    if (cookies) {
      const { accessToken, refreshToken } = JSON.parse(cookies);
      console.log(cookies);
      const { user }: any = jwtDecode(accessToken);
      dispatch(login({ accessToken, user, refreshToken }));
    } else {
      dispatch(login({}));
    }
  }, [dispatch]);

  return (
    <div className="h-24 bg-blue flex items-center justify-center">
      <div className="max-w-[1850px] w-full flex justify-between px-6">
        <div>
          <img src={Logo} alt="logo-ferraro-materiales" />
        </div>
        <div className="flex items-center gap-x-2.5">
          {isLogged && (
            <div className="flex gap-x-4">
              <div
                className="cursor-pointer"
                onClick={() => {
                  dispatch(setShowNavbar(true));
                }}
              >
                <RxHamburgerMenu color="white" size={32} />
              </div>
              {/*     <div
                className="cursor-pointer"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                <MdLogout color="white" size={32} />
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
