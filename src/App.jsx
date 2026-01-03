import { BrowserRouter, Routes, Route, lazy, Suspense } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Layout from './components/Layout';

// تحميل الكسول (lazy loading)
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

const WithLayout = ({ children }) => <Layout>{children}</Layout>;

const LazyComponent = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  }>
    {children}
  </Suspense>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/flocks/new" element={<FlockForm />} />
        <Route path="/flocks/:id" element={<FlockDetails />} />
        <Route path="/flocks/:id/feed" element={<FeedManagement />} />
        <Route path="/flocks/:id/water" element={<WaterManagement />} />
        <Route path="/flocks/:id/environment" element={<EnvironmentMonitoring />} />
        <Route path="/flocks/:id/health" element={<HealthRecords />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* الشاشات مع Layout */}
        <Route path="/dashboard" element={
          <WithLayout>
            <LazyComponent><Dashboard /></LazyComponent>
          </WithLayout>
        } />
        <Route path="/flocks" element={
          <WithLayout>
            <LazyComponent><FlockList /></LazyComponent>
          </WithLayout>
        } />
        <Route path="/inventory" element={
          <WithLayout>
            <LazyComponent><Inventory /></LazyComponent>
          </WithLayout>
        } />
        <Route path="/finance" element={
          <WithLayout>
            <LazyComponent><Finance /></LazyComponent>
          </WithLayout>
        } />
        <Route path="/reports" element={
          <WithLayout>
            <LazyComponent><Reports /></LazyComponent>
          </WithLayout>
        } />
        <Route path="/settings" element={
          <WithLayout>
            <LazyComponent><Settings /></LazyComponent>
          </WithLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
