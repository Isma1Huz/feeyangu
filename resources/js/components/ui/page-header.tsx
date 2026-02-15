/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonIcon,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {buttonLabel && (
        <div className="flex items-center space-x-2 cursor-pointer">
          <Button onClick={onButtonClick} className="cursor-pointer">
            {buttonIcon}
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
