import { useState, useEffect } from 'react';
import { MessageSquare, X, Activity, Info } from 'lucide-react';

interface DiagnosisEntry {
  id: string;
  timestamp: string;
  message: string;
  diagnosis: string;
  mood: string;
}

export function DiagnosisHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('diagnosisTracking') === 'true';
  });

  // Toggle diagnosis tracking
  const toggleDiagnosisTracking = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('diagnosisTracking', String(newState));
    
    if (!newState) {
      // Clear diagnoses when turning off
      setDiagnoses([]);
    }
  };

  // Listen for new diagnoses from the chat
  useEffect(() => {
    if (!isEnabled) return;

    const handleNewMessage = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; diagnosis: string; mood: string }>;
      
      const newDiagnosis: DiagnosisEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        message: customEvent.detail.message,
        diagnosis: customEvent.detail.diagnosis,
        mood: customEvent.detail.mood,
      };

      setDiagnoses(prev => [newDiagnosis, ...prev].slice(0, 50)); // Keep last 50 entries
    };

    window.addEventListener('newDiagnosis', handleNewMessage as EventListener);
    return () => window.removeEventListener('newDiagnosis', handleNewMessage as EventListener);
  }, [isEnabled]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  const getMoodColor = (mood: string) => {
    const moodMap: Record<string, string> = {
      happy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      angry: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      anxious: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return moodMap[mood.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 bottom-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
        } text-white`}
        title={isEnabled ? 'View Diagnosis History' : 'Diagnosis Tracking Off'}
      >
        <Activity className="w-6 h-6" />
      </button>

      {/* Toggle Switch */}
      <div className="fixed right-6 bottom-24 z-50 flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {isEnabled ? 'Tracking On' : 'Tracking Off'}
        </span>
        <button
          onClick={toggleDiagnosisTracking}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Diagnosis Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-scroll">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Diagnosis History
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {!isEnabled ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <Info className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Diagnosis Tracking is Off
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Enable tracking to see your diagnosis history here.
                    </p>
                    <button
                      onClick={toggleDiagnosisTracking}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Enable Tracking
                    </button>
                  </div>
                ) : diagnoses.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Diagnoses Yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Your diagnoses will appear here as you chat.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {diagnoses.map((entry) => (
                        <li key={entry.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                              {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                            {entry.message}
                          </p>
                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                            <h4 className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                              Analysis:
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {entry.diagnosis}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Utility function to dispatch a new diagnosis event
export function logDiagnosis(message: string, diagnosis: string, mood: string) {
  if (localStorage.getItem('diagnosisTracking') === 'true') {
    const event = new CustomEvent('newDiagnosis', {
      detail: { message, diagnosis, mood },
    });
    window.dispatchEvent(event);
  }
}
