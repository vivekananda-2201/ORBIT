import { BrowserRouter } from 'react-router-dom';
import { AppShell } from './components/common/AppShell/AppShell';
import ChatPage from './pages/ChatPage';
import ArenaPage from './pages/ArenaPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <ChatPage />
        <ArenaPage />
        <AboutPage />
      </AppShell>
    </BrowserRouter>
  );
}
