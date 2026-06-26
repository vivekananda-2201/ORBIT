import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/orbit/AppShell';
import ChatPage from './pages/ChatPage';
import ArenaPage from './pages/ArenaPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<ChatPage />} />
          <Route path="arena" element={<ArenaPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
