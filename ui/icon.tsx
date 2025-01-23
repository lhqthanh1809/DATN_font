import React from 'react';
import { cn } from '@/helper/helper';

interface IIcon {
  className?: string;
}

const Icon: React.FC<{
  icon: React.ElementType<IIcon>;
  className?: string;
}> = ({ icon: IconComponent, className }) => {
  
  return <IconComponent className={cn("text-doveGray-600", className)}/>;
};

export default Icon;
export type { IIcon };

