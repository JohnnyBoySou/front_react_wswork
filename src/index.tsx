import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router";

import Models from "@/routes/models";
import Home from '@/routes/index';
import Brands from '@/routes/brands';
import Cars from '@/routes/cars';
import Dashboard from '@/routes/dashboard';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="cars" element={<Cars />} />
        <Route path="brands" element={<Brands />} />
        <Route path="models" element={<Models />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
