import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BaseButtonProps = {
  variant?: 'default' | 'secondary' | 'outline' | 'danger';
  size?: 'default' | 'sm' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
};

type ButtonProps = BaseButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;
type LinkButtonProps = BaseButtonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>;

const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
  outline: 'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-sm',
  lg: 'h-12 rounded-md px-8 text-lg',
};

export function Button({
  variant = 'default',
  size = 'default',
  children,
  isLoading,
  className,
  ...props
}: ButtonProps | LinkButtonProps) {
  const styles = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if ('href' in props) {
    return (
      <a
        className={styles}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </a>
    );
  }

  return (
    <button
      className={styles}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
} 