/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { PaginationLink } from '@/types/super';
import { Link, usePage } from '@inertiajs/react';
import { includes } from 'lodash';
import { ArrowLeft, ArrowRight } from 'lucide-react';


export default function TablePagination({ links }: { links: PaginationLink[] }) {
  const { url } = usePage();
  const basePath = url.split('?')[0];

  return (
    <section className="flex w-full justify-end">
      <div className="flex items-center gap-1 mt-4 p-2 flex-wrap">
        {links.map((i) => {
          let query = '#';
          const queryFromUrl = (i.url || '').split('?');
          if (queryFromUrl.length > 1) {
            query = queryFromUrl[1];
          }

          const isDisabled = i.url === null;

          return (
            <Link
              key={i.label}
              href={i.url ? basePath + '?' + query : '#'}
              className={cn(
                'px-2 py-1 text-sm border border-teal-600 rounded transition-colors',
                {
                  'bg-teal-600 text-white': i.active,
                  'text-gray-400 cursor-not-allowed opacity-50': isDisabled,
                  'hover:bg-gray-100 text-gray-700': !i.active && !isDisabled,
                }
              )}
            >
              {includes(i.label, 'Previous') ? (
                <ArrowLeft className="h-4 w-4" />
              ) : includes(i.label, 'Next') ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                i.label
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
