import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-premium ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
