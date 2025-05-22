import { Link } from 'react-router-dom';
import { MessageSquare, Heart } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <MessageSquare className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to MindSync
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Share your thoughts and feelings with our empathetic AI companion. 
            We're here to listen and support your mental well-being journey.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
            >
              Start Chatting
              <MessageSquare className="ml-2 h-5 w-5" />
            </Link>
            
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </main>
      
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              A simple, effective way to support your mental well-being
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      1
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Share Your Thoughts
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Type freely about your day, feelings, or anything on your mind. 
                      There are no right or wrong answers here.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      2
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Receive Empathetic Support
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our AI provides thoughtful, compassionate responses 
                      to help you process your emotions and thoughts.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      3
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Feel Heard & Understood
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Experience the relief of being truly heard in a 
                      safe, non-judgmental space, anytime you need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} MindSync. Made with <Heart className="inline h-4 w-4 text-red-500" /> for your well-being.
          </p>
        </div>
      </footer>
    </div>
  );
}
