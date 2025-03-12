
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import DatabaseConfig from './pages/admin/DatabaseConfig';
import Backups from './pages/admin/Backups';
import Monitoring from './pages/admin/Monitoring';
import Documentation from './pages/Documentation';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="databases" element={<DatabaseConfig />} />
          <Route path="backups" element={<Backups />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Routes>
      <Route path="/documentation" element={<Documentation />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
