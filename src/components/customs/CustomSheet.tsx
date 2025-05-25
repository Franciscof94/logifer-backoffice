import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../ui/sheet';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const CustomSheet: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[40vh] max-h-[400px] overflow-y-auto p-4">
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle className="text-lg font-medium text-gray-900">{title}</SheetTitle>}
            {description && <SheetDescription className="text-sm text-gray-500">{description}</SheetDescription>}
          </SheetHeader>
        )}
        
        <div className="py-4">
          {children}
        </div>

        {footer && (
          <SheetFooter>
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}; 