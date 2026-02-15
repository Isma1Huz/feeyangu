interface InputErrorProps {
    message: string;
    className?: string;
}

export function InputError({ message, className = '' }: InputErrorProps) {
    return (
        <div className={`mt-1 text-sm text-red-600 ${className}`}>
            {message}
        </div>
    );
}
