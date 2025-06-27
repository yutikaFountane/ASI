import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import './App.css';
import BatchFolio from './pages/BatchFolio';

const Home: React.FC = () => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, marginLeft: '60px', display: 'flex', flexDirection: 'column' }}>
      <HeaderBar />
      <div className="main-content">
        <div className="content-container">
          Welcome to ASI Home!
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#3E4BE0',
      },
    }}
  >
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/batch-folio" element={<BatchFolio />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  </ConfigProvider>
);

export default App;
