import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import FlockList from './screens/FlockList';
import FlockForm from './screens/FlockForm';
import FlockDetails from './screens/FlockDetails';
import FeedManagement from './screens/FeedManagement';
import WaterManagement from './screens/WaterManagement';
import EnvironmentMonitoring from './screens/EnvironmentMonitoring';
import HealthRecords from './screens/HealthRecords';
import Reports from './screens/Reports';
import Notifications from './screens/Notifications';
import Settings from './screens/Settings';
import Finance from './screens/Finance';
import Inventory from './screens/Inventory';
import Layout from './components/Layout';
import { Suspense } from 'react';

const WithLayout = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-4 text-center text-gray-500">جاري التحميل...</div>}>
        <Routes>
          {/* بدون Layout */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/flocks/new" element={<FlockForm />} />
          <Route path="/flocks/:id" element={<FlockDetails />} />
          <Route path="/flocks/:id/feed" element={<FeedManagement />} />
          <Route path="/flocks/:id/water" element={<WaterManagement />} />
          <Route path="/flocks/:id/environment" element={<EnvironmentMonitoring />} />
          <Route path="/flocks/:id/health" element={<HealthRecords />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* مع Layout */}
          <Route path="/dashboard" element={<WithLayout><Dashboard /></WithLayout>} />
          <Route path="/flocks" element={<WithLayout><FlockList /></WithLayout>} />
          <Route path="/inventory" element={<WithLayout><Inventory /></WithLayout>} />
          <Route path="/finance" element={<WithLayout><Finance /></WithLayout>} />
          <Route path="/reports" element={<WithLayout><Reports /></WithLayout>} />
          <Route path="/settings" element={<WithLayout><Settings /></WithLayout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
