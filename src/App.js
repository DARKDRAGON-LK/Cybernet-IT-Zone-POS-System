import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './component/dashbord/Dashbord';
import Product from './component/product/Product';
import Sales from './component/sales/Sales';
import Purchase from './component/Purchese/Purchese';
import Login from './component/login/Login';
import { AuthProvider } from './component/AuthProvider/AuthProvider';
import Logout from './component/Logout/Logout';
import Invoice from './component/Innoice/Invoice';
import Error404 from "./component/Error404/Error404";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/product" element={<Product />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/*" element={<Error404/>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
