import { createBrowserRouter } from 'react-router';
import { RootShell } from './components/RootShell';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Benchmarks } from './pages/Benchmarks';
import { RAGStore } from './pages/RAGStore';
import { AgentsLab } from './pages/AgentsLab';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootShell,
    children: [
      { index: true, Component: Dashboard },
      { path: 'chat', Component: Chat },
      { path: 'benchmarks', Component: Benchmarks },
      { path: 'rag', Component: RAGStore },
      { path: 'agents', Component: AgentsLab },
      { path: 'settings', Component: Dashboard },
    ],
  },
]);
