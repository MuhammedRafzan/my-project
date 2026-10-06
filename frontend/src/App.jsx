import { Routes, Route } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SurveyForm />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
