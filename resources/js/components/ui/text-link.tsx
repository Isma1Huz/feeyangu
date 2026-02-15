import { Link } from '@inertiajs/react';

interface TextLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function TextLink({ href, children, className = '' }: TextLinkProps) {
    return (
        <Link href={href} className={`font-medium text-indigo-600 hover:text-indigo-500 ${className}`}>
            {children}
        </Link>
    );
}
