import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from '../stores/user';
import Home from "../views/home/index.jsx";
import Login from "../views/auth/login.jsx";
import Dashboard from "../views/dashboard/index.jsx";
import CategoriesIndex from "../views/categories/index.jsx";
import ProductsIndex from "../views/products/index.jsx";
import CustomersIndex from "../views/customers/index.jsx";
import UsersIndex from "../views/users/index.jsx";
import UserShow from "../views/users/show.jsx";
import TransactionsIndex from "../views/transactions/index.jsx";
import Print from "../views/transactions/print/print.jsx";
import SalesIndex from "../views/sales/index.jsx";
import ProfitsIndex from "../views/profits/index.jsx";
import CustomerHome from "../views/customer/index.jsx";
import CustomerProfile from "../views/customer/profile.jsx";
import CustomerLogin from "../views/customer/login.jsx";
import CustomerRegister from "../views/customer/register.jsx";

import { useCustomerStore } from "../stores/customer.js";

export default function AppRoutes() {

  //destruct state "token" from store
  const { token } = useStore();
  const { customerToken } = useCustomerStore();

  return (
    <Routes>

      {/* route "/" */}
      <Route path="/" element={<Home />} />

      {/* route "/login" */}
      <Route path="/login" element={
        customerToken ? <Navigate to="/customer" replace /> : <CustomerLogin />
      } />

      {/* route "/customer/register" */}
      <Route path="/customer/register" element={
        customerToken ? <Navigate to="/customer" replace /> : <CustomerRegister />
      } />

      {/* route "/login/staff" */}
      <Route path="/login/staff" element={
        token ? <Navigate to="/dashboard" replace /> : <Login />
      } />

      {/* route "/customer" */}
      <Route path="/customer" element={
        customerToken ? <CustomerHome /> : <Navigate to="/login" replace />
      } />

      {/* route "/customer/profile" */}
      <Route path="/customer/profile" element={
        customerToken ? <CustomerProfile /> : <Navigate to="/login" replace />
      } />

      {/* route "/dashboard" */}
      <Route path="/dashboard" element={
        token ? <Dashboard /> : <Navigate to="/login/staff" replace />
      } />

      {/* route "/categories" */}
      <Route path="/categories" element={
        token ? <CategoriesIndex /> : <Navigate to="/login/staff" replace />
      } />

      {/* {route} "/products" */}
      <Route path="/products" element={
        token ? <ProductsIndex /> : <Navigate to='/login/staff' replace />
      } />

      {/* {route} "customers"*/}
      <Route path="/customers" element={
        token ? <CustomersIndex /> : <Navigate to="/login/staff" replace />
      } />

      <Route path="/users" element={
        token ? <UsersIndex /> : <Navigate to="/login/staff" replace />
      } />

      <Route path="/users/:id" element={
        token ? <UserShow /> : <Navigate to="/login/staff" replace />
      } />

      <Route path="/transactions" element={
        token ? <TransactionsIndex /> : <Navigate to="/login/staff" replace />
      } />

      <Route path="/transactions/print" element={
        token ? <Print /> : <Navigate to="/login/staff" replace />
      } />

      <Route path="/sales" element={
        token ? <SalesIndex /> : <Navigate to="/login/staff" replace />
      } />

      <Route path="/profits" element={
        token ? <ProfitsIndex /> : <Navigate to="/login/staff" replace />
      } />

    </Routes>
  );
}
