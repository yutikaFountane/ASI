import React, { useEffect } from 'react';

const checkIcon = "http://localhost:3845/assets/b232be8563af16edd11800d6b053933b2b715fc6.svg"; // Replace with your deployed asset path if needed

export default function ExportSuccessAlert({ folioNames, onClose }: { folioNames: string, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      background: '#f0fff4',
      border: '1px solid #9ae6b4',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      minWidth: 320,
      fontFamily: 'Source Sans 3, sans-serif'
    }}>
      <img src={checkIcon} alt="Success" style={{ width: 24, height: 24, marginRight: 12 }} />
      <span style={{ fontWeight: 600, fontSize: 14, marginRight: 4 }}>{folioNames} </span>
      <span style={{ fontSize: 14 }}>have been successfully downloaded.</span>
      <button onClick={onClose} style={{
        background: 'none',
        border: 'none',
        marginLeft: 16,
        cursor: 'pointer',
        fontSize: 18,
        color: '#888'
      }}>×</button>
    </div>
  );
} 