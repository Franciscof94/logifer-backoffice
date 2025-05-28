import { Route, Routes } from "react-router-dom";
import { RequireAuth, Header } from "./components";
import { VIEW_HOME } from "./constants/permissions";
import Dashboard from "./containers/dashboard/Dashboard";
import PublicContainer from "./containers/public/PublicContainer";
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from "./routes";
import { Login, Missing, NewOrder, Reports } from "./views";
import { Orders } from "./views/Orders";
import { NewClient } from "./views/NewClient";
import { Clients } from "./views/Clients";
import { NewProduct } from "./views/NewProduct";
import { Products } from "./views/Products";
import { Home } from "./views/Home";

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route element={<PublicContainer />}>
            <Route path={PUBLIC_ROUTE.LOGIN} element={<Login />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<Dashboard />}>
              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route
                  path={PRIVATE_ROUTE["NEW-ORDER"]}
                  element={<NewOrder />}
                />
              </Route>

              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route path={PRIVATE_ROUTE.ODERS} element={<Orders />} />
              </Route>

              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route
                  path={PRIVATE_ROUTE["NEW-CLIENT"]}
                  element={<NewClient />}
                />
              </Route>

              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route path={PRIVATE_ROUTE.CLIENTS} element={<Clients />} />
              </Route>
              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route
                  path={PRIVATE_ROUTE["NEW-PRODUCT"]}
                  element={<NewProduct />}
                />
              </Route>

              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route path={PRIVATE_ROUTE.PRODUCTS} element={<Products />} />
              </Route>

              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route path={PRIVATE_ROUTE.ODERS} element={<Header />} />
              </Route>

              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route path={PRIVATE_ROUTE.REPORTS} element={<Reports />} />
              </Route>

              <Route element={<RequireAuth permissions={[VIEW_HOME]} />}>
                <Route path={PRIVATE_ROUTE.HOME} element={<Home />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Missing />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;