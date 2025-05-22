import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Home, Menu, X, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

const navItems = [
  { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
  { name: 'Chat', path: '/chat', icon: <MessageSquare className="w-5 h-5" /> },
  { name: 'Diagnosis', path: '/diagnosis' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: -20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const mobileMenu = {
  open: { 
    opacity: 1,
    height: 'auto',
    transition: { 
      type: 'spring', 
      bounce: 0.1,
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.1
    } 
  },
  closed: { 
    opacity: 0,
    height: 0,
    transition: { 
      type: 'spring', 
      bounce: 0.1,
      duration: 0.3,
      staggerChildren: 0.1,
      staggerDirection: -1
    } 
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when navigating
    const unlisten = () => {
      setIsOpen(false);
    };
    return unlisten;
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-colors duration-300 ${
        scrolled ? 'bg-white' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Bot className="h-6 w-6 text-blue-600" />
              <span>MindSync</span>
            </Link>
            <Button
              variant="default"
              size="sm"
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate('/chat')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <motion.div 
              className="flex items-center space-x-1"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {navItems.map((navItem) => (
                <motion.div key={navItem.name} variants={item}>
                  <Link
                    to={navItem.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === navItem.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {navItem.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenu}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((navItem) => (
                <motion.div 
                  key={navItem.name}
                  variants={{
                    open: { x: 0, opacity: 1 },
                    closed: { x: -20, opacity: 0 }
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Link
                    to={navItem.path}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      location.pathname === navItem.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {navItem.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
