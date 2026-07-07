import React from 'react';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  let btnClass = 'btn-premium-primary';
  if (variant === 'secondary') btnClass = 'btn-premium-secondary';
  if (variant === 'accent') btnClass = 'btn-premium-accent';
  if (variant === 'outline-primary' || variant === 'outline-secondary' || variant === 'outline') {
    btnClass = 'btn-premium-outline';
  }
  
  return (
    <button 
      className={`btn-premium ${btnClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
