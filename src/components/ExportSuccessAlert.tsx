import React, { useEffect } from 'react';
import CorrectIcon from '../assets/Icons/Correct.svg';

interface ExportSuccessAlertProps {
  folioNames: string;
  onClose: () => void;
}

export default function ExportSuccessAlert({ folioNames, onClose }: ExportSuccessAlertProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 32,
      right: 32,
      zIndex: 9999,
      background: '#F0FFF4',
      border: '1px solid #9AE6B4',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      minWidth: 320,
      maxWidth: 700,
      fontFamily: 'Source Sans 3, Inter, sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      gap: 12,
    }}>
      <img src={CorrectIcon} alt="Success" style={{ width: 24, height: 24, marginRight: 8, flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.88)', lineHeight: '22px', fontWeight: 400, wordBreak: 'break-word' }}>
          <span style={{ fontWeight: 700 }}>{folioNames}</span> has been successfully emailed to the respective points of contact.
        </span>
      </div>
      <button onClick={onClose} style={{
        background: 'none',
        border: 'none',
        marginLeft: 8,
        cursor: 'pointer',
        fontSize: 24,
        color: 'rgba(0,0,0,0.45)',
        lineHeight: 1,
        padding: 0,
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }} aria-label="Close notification">×</button>
    </div>
  );
} 