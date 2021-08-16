import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import ProductDetail from "./product/ProductDetail";
import ProductList from "./product/ProductList";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "../data/config/queryClient";
import CreateProduct from "./product/CreateProduct";

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Switch>
            <Route path="/" exact>
              <ProductList />
            </Route>
            <Route path="/products/create" exact>
              <CreateProduct />
            </Route>
            <Route path="/products/:id" exact>
              <ProductDetail />
            </Route>
          </Switch>
        </Layout>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
