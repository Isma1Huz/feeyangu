import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tableVariants = cva(
  'w-full caption-bottom text-sm border-collapse',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-gray-200',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-gray-50',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
      },
      density: {
        compact: '',
        normal: '',
        comfortable: '',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      // Compact density
      {
        density: 'compact',
        size: 'xs',
        class: '[&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1',
      },
      {
        density: 'compact',
        size: 'sm',
        class: '[&_th]:px-3 [&_td]:px-3 [&_th]:py-1.5 [&_td]:py-1.5',
      },
      // Normal density
      {
        density: 'normal',
        size: 'sm',
        class: '[&_th]:px-3 [&_td]:px-3 [&_th]:py-2 [&_td]:py-2',
      },
      {
        density: 'normal',
        size: 'md',
        class: '[&_th]:px-4 [&_td]:px-4 [&_th]:py-3 [&_td]:py-3',
      },
      // Comfortable density
      {
        density: 'comfortable',
        size: 'md',
        class: '[&_th]:px-5 [&_td]:px-5 [&_th]:py-4 [&_td]:py-4',
      },
      {
        density: 'comfortable',
        size: 'lg',
        class: '[&_th]:px-6 [&_td]:px-6 [&_th]:py-4 [&_td]:py-4',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      density: 'normal',
      fullWidth: true,
    },
  }
);

interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /**
   * Whether the table should take up the full width of its container
   * @default true
   */
  fullWidth?: boolean;
  /**
   * Whether the table should have a border
   * @default false
   */
  bordered?: boolean;
  /**
   * Whether the table rows should have alternating background colors
   * @default false
   */
  striped?: boolean;
  /**
   * The visual style of the table
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'striped';
  /**
   * The size of the table
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * The density of the table
   * @default 'normal'
   */
  density?: 'compact' | 'normal' | 'comfortable';
  /**
   * Whether the table should be scrollable horizontally on mobile
   * @default true
   */
  scrollable?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    density = 'normal',
    fullWidth = true,
    scrollable = true,
    ...props
  }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn(
          tableVariants({ variant, size, density, fullWidth }),
          className
        )}
        {...props}
      />
    );

    return scrollable ? (
      <div className="relative w-full overflow-x-auto">
        {table}
      </div>
    ) : (
      table
    );
  }
);
Table.displayName = 'Table';

interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Whether the section has a subtle background color
   * @default false
   */
  subtle?: boolean;
}

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>(({ className, subtle = false, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      'bg-gray-50 [&_tr]:border-b [&_tr]:border-gray-200',
      subtle && 'bg-gray-50/50',
      className
    )} 
    {...props} 
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>(({ className, subtle = false, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      '[&_tr:last-child]:border-0',
      subtle && 'bg-gray-50/30',
      className
    )}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>(({ className, subtle = false, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'bg-gray-50 font-medium text-gray-900 border-t border-gray-200',
      subtle && 'bg-gray-50/70',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Whether the row is in a hover state
   * @default true
   */
  hoverable?: boolean;
  /**
   * Whether the row is in a selected state
   * @default false
   */
  selected?: boolean;
  /**
   * Whether the row has a border
   * @default true
   */
  bordered?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({
    className,
    hoverable = true,
    selected = false,
    bordered = true,
    ...props
  }, ref) => (
    <tr
      ref={ref}


      
      className={cn(
        'transition-colors',
        hoverable && 'hover:bg-gray-50',
        selected && 'bg-blue-50 hover:bg-blue-50/80',
        bordered && 'border-b border-gray-100 last:border-b-0',
        className
      )}
      data-selected={selected ? '' : undefined}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Text alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  /**
   * Whether the cell is sortable
   * @default false
   */
  sortable?: boolean;
  /**
   * Sort direction
   */
  sortDirection?: 'asc' | 'desc' | false;
  /**
   * Callback when sort is requested
   */
  onSort?: () => void;
  /**
   * Whether the column is currently being sorted
   * @default false
   */
  isSorted?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({
    className,
    align = 'left',
    sortable = false,
    sortDirection,
    onSort,
    isSorted = false,
    children,
    ...props
  }, ref) => {
    const handleClick = () => {
      if (sortable && onSort) {
        onSort();
      }
    };

    return (
      <th
        ref={ref}
        className={cn(
          'h-12 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider',
          'align-middle whitespace-nowrap',
          sortable && 'cursor-pointer select-none hover:bg-gray-100/50',
          {
            'text-left': align === 'left',
            'text-center': align === 'center',
            'text-right': align === 'right',
            'pr-10': sortable,
          },
          className
        )}
        onClick={handleClick}
        aria-sort={
          sortable ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : undefined
        }
        {...props}
      >
        <div className={cn(
          'flex items-center',
          {
            'justify-start': align === 'left',
            'justify-center': align === 'center',
            'justify-end': align === 'right',
          }
        )}>
          {children}
          {sortable && (
            <span className="ml-2 flex-shrink-0">
              {!isSorted ? (
                <svg className="h-4 w-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              ) : sortDirection === 'asc' ? (
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </span>
          )}
        </div>
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Text alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right' | 'justify';
  /**
   * Whether the cell should truncate text with an ellipsis
   * @default false
   */
  truncate?: boolean;
  /**
   * Whether the cell is a header cell
   * @default false
   */
  header?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({
    className,
    align = 'left',
    truncate = false,
    header = false,
    children,
    ...props
  }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 text-sm text-gray-700',
        'align-middle',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
          'whitespace-nowrap': !truncate,
          'truncate max-w-xs': truncate,
          'font-medium text-gray-900': header,
        },
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = 'TableCell';

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  /**
   * The position of the caption relative to the table
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
  /**
   * Whether to hide the caption visually but keep it accessible to screen readers
   * @default false
   */
  srOnly?: boolean;
}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, position = 'bottom', srOnly = false, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(
        'text-sm text-gray-500',
        position === 'top' ? 'mb-2' : 'mt-4',
        srOnly && 'sr-only',
        className
      )}
      {...props}
    />
  )
);
TableCaption.displayName = 'TableCaption';

interface TableEmptyStateProps {
  /**
   * The title to display
   */
  title: string;
  /**
   * The description to display below the title
   */
  description?: string;
  /**
   * An optional icon to display above the title
   */
  icon?: React.ReactNode;
  /**
   * The number of columns the table has (for proper colspan)
   * @default 1
   */
  colSpan?: number;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Additional props for the cell
   */
  cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
}

/**
 * A component to display when a table has no data
 */
const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  title,
  description,
  icon,
  colSpan = 1,
  className,
  cellProps,
}) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className={cn('py-12 text-center', className)}
      align="center"
      {...cellProps}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        {icon && <div className="text-gray-400 mb-2">{icon}</div>}
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 max-w-md">{description}</p>
        )}
      </div>
    </TableCell>
  </TableRow>
);
TableEmptyState.displayName = 'TableEmptyState';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmptyState,
};

export type {
  TableProps,
  TableSectionProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
  TableEmptyStateProps,
};
