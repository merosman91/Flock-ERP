import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import FlockList from './screens/FlockList';
import FlockForm from './screens/FlockForm';
import { Suspense } from 'react';

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
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
