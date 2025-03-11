
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  buttonText,
  onButtonClick
}) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto text-gray-300">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-12 w-12 mx-auto' })}
      </div>
      <h3 className="mt-2 text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>
      {buttonText && onButtonClick && (
        <Button className="mt-4" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
