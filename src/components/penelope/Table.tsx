import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  header: string;
}

interface TableProps {
  columns: Column[];
  children: ReactNode;
  className?: string;
}

export function Table({ columns, children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border', className)}>
      <table className="table-institutional">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className }: TableRowProps) {
  return <tr className={className}>{children}</tr>;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

export function TableCell({ children, className, highlight }: TableCellProps) {
  return (
    <td className={cn(highlight && 'text-highlight', className)}>
      {children}
    </td>
  );
}
