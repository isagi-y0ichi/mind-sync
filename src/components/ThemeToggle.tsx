import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleProps {
  theme: string | undefined;
  toggleTheme: () => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'ghost' | 'outline' | 'default' | 'link' | 'secondary' | 'destructive';
  showText?: boolean;
}

export function ThemeToggle({ 
  theme, 
  toggleTheme, 
  className = '',
  size = 'icon',
  variant = 'ghost',
  showText = false
}: ThemeToggleProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
      ) : (
        <Moon className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
      )}
      {showText && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
    </Button>
  );
}

export default ThemeToggle;
