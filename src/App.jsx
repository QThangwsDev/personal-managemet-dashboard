import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import UserLayout from './layout/UserLayout';
import Overview from './pages/Overview';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Expense from './pages/Expenses';
import Cycle from './pages/Cycle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Định nghĩa Route cha bọc các trang con */}
        <Route path="/" element={<UserLayout />}>
          {/* Các route con nằm bên trong, lưu ý index đại diện cho trang chủ '/' */}
          <Route index element={<Overview />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="expense" element={<Expense />} />
          <Route path="cycle" element={<Cycle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;