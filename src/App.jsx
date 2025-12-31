import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import FlockList from './screens/FlockList';
import FlockForm from './screens/FlockForm';
import { Suspense } from 'react';
import Notifications from './screens/Notifications';
import Settings from './screens/Settings';
import Finance from './screens/Finance';
import Inventory from './screens/Inventory';

export default App;
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-4">جاري التحميل...</div>}>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flocks" element={<FlockList />} />
          <Route path="/flocks/new" element={<FlockForm />} />
          <Route path="/flocks/:id" element={<FlockForm />} />
          <Route path="/flocks/:id" element={<FlockDetails />} />
          <Route path="/flocks/:id/feed" element={<FeedManagement />} />
          <Route path="/flocks/:id/water" element={<WaterManagement />} />
          <Route path="/flocks/:id/environment" element={<EnvironmentMonitoring />} />
          <Route path="/flocks/:id/health" element={<HealthRecords />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
