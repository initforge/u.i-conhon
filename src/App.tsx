import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { SocialTaskProvider } from './contexts/SocialTaskContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'

// Public pages
import HomePage from './pages/HomePage'
import HuongDanPage from './pages/HuongDanPage'
import LoginPage from './pages/LoginPage'
import ChonThaiPage from './pages/ChonThaiPage'

// User pages (require login - wrapped in UserLayout)
import MuaConVatPage from './pages/MuaConVatPage'
import ThanhToanPage from './pages/ThanhToanPage'
import HoaDonPage from './pages/HoaDonPage'
import KetQuaPage from './pages/KetQuaPage'
import CongDongPage from './pages/CongDongPage'
import ThongTinCaNhanPage from './pages/ThongTinCaNhanPage'
import HoTroPage from './pages/HoTroPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDonHang from './pages/admin/AdminDonHang'
import AdminConVat from './pages/admin/AdminConVat'
import AdminNguoiChoi from './pages/admin/AdminNguoiChoi'
import AdminBaoCao from './pages/admin/AdminBaoCao'
import AdminCMS from './pages/admin/AdminCMS'
import AdminNhiemVuMXH from './pages/admin/AdminNhiemVuMXH'
import AdminCaiDat from './pages/admin/AdminCaiDat'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SocialTaskProvider>
          <Router>
            <Routes>
              {/* Public routes with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="huong-dan" element={<HuongDanPage />} />
                <Route path="dang-nhap" element={<LoginPage />} />
              </Route>

              {/* Public standalone pages */}
              <Route path="/chon-thai" element={<ChonThaiPage />} />

              {/* User routes with UserLayout - requires login */}
              <Route path="/user" element={<UserLayout />}>
                <Route index element={<Navigate to="/user/mua-con-vat" replace />} />
                <Route path="mua-con-vat" element={<MuaConVatPage />} />
                <Route path="thanh-toan" element={<ThanhToanPage />} />
                <Route path="hoa-don/:orderId" element={<HoaDonPage />} />
                <Route path="ket-qua" element={<KetQuaPage />} />
                <Route path="cong-dong" element={<CongDongPage />} />
                <Route path="thong-tin-ca-nhan" element={<ThongTinCaNhanPage />} />
                <Route path="ho-tro" element={<HoTroPage />} />
              </Route>

              {/* Admin routes with AdminLayout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="don-hang" element={<AdminDonHang />} />
                <Route path="con-vat" element={<AdminConVat />} />
                <Route path="nguoi-choi" element={<AdminNguoiChoi />} />
                <Route path="bao-cao" element={<AdminBaoCao />} />
                <Route path="cms" element={<AdminCMS />} />
                <Route path="nhiem-vu-mxh" element={<AdminNhiemVuMXH />} />
                <Route path="cai-dat" element={<AdminCaiDat />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SocialTaskProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
