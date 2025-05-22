import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';

export function App() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6 h-[calc(100vh-5rem)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route 
            path="/diagnosis" 
            element={
              <div className="pt-20 px-4 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Diagnosis History</h1>
                <p className="text-gray-600">Your chat diagnoses will appear here when enabled.</p>
              </div>
            } 
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}


