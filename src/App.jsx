

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SurveyPage from './pages/SurveyPage';
import ResultsPage from './pages/ResultsPage';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SurveyPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </HashRouter>
  );
};

// تأكد من وجود export default
export default App;