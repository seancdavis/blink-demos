import React from 'react';
import { Outlet } from 'react-router';
import { Header } from './components/Header';

function App() {
  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;