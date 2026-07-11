import React from 'react';

const DEFAULT_AVATAR = 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png';

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '', style = {}, ...props }) => {
  let dimensions = { width: '40px', height: '40px' };
  
  if (size === 'xs') {
    dimensions = { width: '28px', height: '28px' };
  } else if (size === 'sm') {
    dimensions = { width: '32px', height: '32px' };
  } else if (size === 'lg') {
    dimensions = { width: '70px', height: '70px' };
  } else if (size === 'xl') {
    dimensions = { width: '100px', height: '100px' };
  } else if (size === 'xxl') {
    dimensions = { width: '120px', height: '120px' };
  } else if (typeof size === 'number') {
    dimensions = { width: `${size}px`, height: `${size}px` };
  } else if (typeof size === 'string' && (size.endsWith('px') || size.endsWith('rem') || size.endsWith('%'))) {
    dimensions = { width: size, height: size };
  }

  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  return (
    <img
      src={src || DEFAULT_AVATAR}
      alt={alt}
      className={`rounded-circle border ${className}`}
      style={{
        ...dimensions,
        objectFit: 'cover',
        objectPosition: 'center',
        flexShrink: 0,
        ...style
      }}
      onError={handleImageError}
      {...props}
    />
  );
};

export default Avatar;
