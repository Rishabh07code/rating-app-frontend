import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import Admin from './Admin/Admin'; 
import User from './User/User'; 
import StoreOwner from './Store/StoreOwner';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/*" element={<Admin />} />
      </Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
        <Route path="/stores/*" element={<User />} />
      </Route>

      {/* Owner Routes */}
      <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
        <Route path="/owner/*" element={<StoreOwner />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
