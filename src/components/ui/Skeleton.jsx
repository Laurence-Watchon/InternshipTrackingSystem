import React from 'react';

const Skeleton = ({ 
  variant = 'rectangular', 
  width, 
  height, 
  className = '' 
}) => {
  const baseClass = "animate-shimmer bg-gray-200";
  
  const variantClasses = {
    text: "rounded h-4 w-full mb-2",
    circular: "rounded-full",
    rectangular: "rounded-lg"
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div 
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
