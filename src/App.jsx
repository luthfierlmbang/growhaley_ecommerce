import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

/* ── Customer layout & pages ── */
import DefaultLayout from './Layouts/DefaultLayout'
import Homepage    from './Pages/Homepage'
import Product     from './Pages/Product'
import Detail      from './Pages/Detail'
import Cart        from './Pages/Cart'
import Checkout    from './Pages/Checkout'
import Payment     from './Pages/Payment'
import Address     from './Pages/Address'
import Blog        from './Pages/Blog'
import BlogDetail  from './Pages/BlogDetail'
import Tracking    from './Pages/Tracking'
import Privacy     from './Pages/Privacy'
import Terms       from './Pages/Terms'
import Orders      from './Pages/Orders'
import OrderDetail from './Pages/OrderDetail'

/* ── Admin ── */
import AdminLogin     from './admin/AdminLogin'
import AdminLayout    from './admin/AdminLayout'
import AdminGuard     from './admin/AdminGuard'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminOrders    from './admin/pages/AdminOrders'
import AdminInventory from './admin/pages/AdminInventory'
import AdminCustomers from './admin/pages/AdminCustomers'
import AdminBlogs     from './admin/pages/AdminBlogs'

const App = () => {
  return (
    <Routes>
      {/* ── Customer routes ── */}
      <Route path="" element={<DefaultLayout />}>
        <Route index element={<Homepage />} />
        <Route path="product"      element={<Product />} />
        <Route path="detail"       element={<Detail />} />
        <Route path="cart"         element={<Cart />} />
        <Route path="checkout"     element={<Checkout />} />
        <Route path="payment"      element={<Payment />} />
        <Route path="address"      element={<Address />} />
        <Route path="blog"         element={<Blog />} />
        <Route path="blog/detail"  element={<BlogDetail />} />
        <Route path="tracking"     element={<Tracking />} />
        <Route path="privacy"      element={<Privacy />} />
        <Route path="terms"        element={<Terms />} />
        <Route path="orders"       element={<Orders />} />
        <Route path="orders/:ref"  element={<OrderDetail />} />
      </Route>

      {/* ── Admin login (no layout) ── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin dashboard (protected) ── */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index          element={<AdminDashboard />} />
        <Route path="orders"    element={<AdminOrders />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="blogs"     element={<AdminBlogs />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
