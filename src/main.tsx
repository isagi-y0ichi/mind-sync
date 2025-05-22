import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import './styles/globals.css';
import { App } from './App';
import { Navbar } from './components/Navbar';
import { DiagnosisHistory } from './components/DiagnosisHistory';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Root() {
  useEffect(() => {
    // Register service worker for PWA
    serviceWorkerRegistration.register({
      onSuccess: (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      onUpdate: (registration) => {
        console.log('New content is available and will be used when all tabs are closed.');
        // You can add a custom UI to prompt the user to update the app
        if (window.confirm('A new version is available! Would you like to update now?')) {
          const waitingServiceWorker = registration.waiting;
          if (waitingServiceWorker) {
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      },
    });
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <main className="pt-16">
                <App />
              </main>
              <DiagnosisHistory />
              <Toaster 
                position="bottom-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'hsl(var(--popover))',
                    color: 'hsl(var(--popover-foreground))',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: 'var(--radius)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                  },
                  success: {
                    iconTheme: {
                      primary: 'hsl(var(--success))',
                      secondary: 'hsl(var(--success-foreground))',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'hsl(var(--destructive))',
                      secondary: 'hsl(var(--destructive-foreground))',
                    },
                  },
                }}
              />
            </div>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
