import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Layout from './components/Layout';
import LoadingBar from './components/LoadingBar';

// Lazy loading
const Dashboard = lazy(() => import('./screens/Dashboard'));
const FlockList = lazy(() => import('./screens/FlockList'));
const FlockForm = lazy(() => import('./screens/FlockForm'));
const FlockDetails = lazy(() => import('./screens/FlockDetails'));
const FeedManagement = lazy(() => import('./screens/FeedManagement'));
const WaterManagement = lazy(() => import('./screens/WaterManagement'));
const EnvironmentMonitoring = lazy(() => import('./screens/EnvironmentMonitoring'));
const HealthRecords = lazy(() => import('./screens/HealthRecords'));
const Reports = lazy(() => import('./screens/Reports'));
const Notifications = lazy(() => import('./screens/Notifications'));
const Settings = lazy(() => import('./screens/Settings'));
const Finance = lazy(() => import('./screens/Finance'));
const Inventory = lazy(() => import('./screens/Inventory'));

const LazyComponent = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  }>
    {children}
  </Suspense>
);

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <BrowserRouter>
      <LoadingBar />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        
        {/* الشاشات التي تتطلب Layout - الطريقة الصحيحة */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <LazyComponent><Dashboard /></LazyComponent>
            </Layout>
          } 
        />
        <Route 
          path="/flocks" 
          element={
            <Layout>
              <LazyComponent><FlockList /></LazyComponent>
            </Layout>
          } 
        />
        <Route 
          path="/inventory" 
          element={
            <Layout>
              <LazyComponent><Inventory /></LazyComponent>
            </Layout>
          } 
        />
        <Route 
          path="/finance" 
          element={
            <Layout>
              <LazyComponent><Finance /></LazyComponent>
            </Layout>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <Layout>
              <LazyComponent><Reports /></LazyComponent>
            </Layout>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <Layout>
              <LazyComponent><Settings /></LazyComponent>
            </Layout>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <Layout>
              <LazyComponent><Notifications /></LazyComponent>
            </Layout>
          } 
        />
        
        {/* الشاشات بدون Layout */}
        <Route path="/flocks/new" element={<FlockForm />} />
        <Route path="/flocks/:id" element={<FlockDetails />} />
        <Route path="/flocks/:id/feed" element={<FeedManagement />} />
        <Route path="/flocks/:id/water" element={<WaterManagement />} />
        <Route path="/flocks/:id/environment" element={<EnvironmentMonitoring />} />
        <Route path="/flocks/:id/health" element={<HealthRecords />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
