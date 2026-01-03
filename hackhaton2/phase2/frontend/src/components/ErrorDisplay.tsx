'use client'
import React from 'react';
import { useError } from '../services/error';

export default function ErrorDisplay() {
  const { error, setError } = useError();

  if (!error) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '10px 20px',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '5px',
      zIndex: 1000,
    }}>
      <span>{error}</span>
      <button onClick={() => setError(null)} style={{ marginLeft: '10px', color: 'white' }}>
        X
      </button>
    </div>
  );
}
