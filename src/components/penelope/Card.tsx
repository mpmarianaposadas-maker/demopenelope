import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article';
}

export function Card({ children, className, as: Component = 'div' }: CardProps) {
  return (
    <Component className={cn('card-institutional p-5 md:p-6 mb-4 last:mb-0', className)}>
      {children}
    </Component>
  );
}

interface CardTitleProps {
  children: ReactNode;
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
}

export function CardTitle({ children, as: Component = 'h2', className }: CardTitleProps) {
  return (
    <Component
      className={cn(
        'font-serif font-semibold text-foreground mb-3',
        Component === 'h2' && 'text-xl md:text-2xl',
        Component === 'h3' && 'text-lg md:text-xl',
        Component === 'h4' && 'text-base md:text-lg',
        className
      )}
    >
      {children}
    </Component>
  );
}

interface CardTextProps {
  children: ReactNode;
  className?: string;
}

export function CardText({ children, className }: CardTextProps) {
  return (
    <p className={cn('text-muted-foreground leading-relaxed mb-3 last:mb-0', className)}>
      {children}
    </p>
  );
}

interface CardListProps {
  items: string[];
  className?: string;
}

export function CardList({ items, className }: CardListProps) {
  return (
    <ul className={cn('list-disc list-inside space-y-2 text-muted-foreground mb-3', className)}>
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}
