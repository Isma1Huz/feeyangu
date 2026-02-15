import React from 'react';
import { Button } from './button';
import { DropdownMenu } from './dropdown-menu';
import { cn } from '@/lib/utils';

interface ActionDropdownProps {
  title: string;
  items: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export function ActionDropdown({ title, items }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {title}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56">
        {items.map((item, index) => (
          <DropdownMenu.Item key={index} onClick={item.onClick}>
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
