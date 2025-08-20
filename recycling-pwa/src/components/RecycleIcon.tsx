import React from 'react';

interface RecycleIconProps {
  size?: number;
  color?: string;
}

const RecycleIcon: React.FC<RecycleIconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <span 
      style={{ 
        fontSize: `${size}px`, 
        color: color,
        display: 'inline-block',
        lineHeight: 1
      }}
    >
      ♻️
    </span>
  );
};

export default RecycleIcon;

