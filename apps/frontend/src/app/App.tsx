import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import ModuleAEntry from '../moduleA/ModuleAEntry';
import ModuleBEntry from '../moduleB/ModuleBEntry';
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="module-a" element={<ModuleAEntry />} />
        <Route path="module-b" element={<ModuleBEntry />} />
        <Route path="*" element={<Navigate to="module-a" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
