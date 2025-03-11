
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  progress?: number;
  button?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle,
  progress,
  button
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-3" />
        )}
        {button && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 w-full"
            onClick={button.onClick}
          >
            {button.icon}
            {button.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
