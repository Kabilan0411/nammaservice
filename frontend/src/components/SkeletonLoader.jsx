import React from 'react';

const SkeletonLoader = ({ type }) => {
  const classes = `skeleton ${type}`;
  
  return (
    <div className={classes}>
      <style>{`
        .skeleton {
          background: #e2e8f0;
          background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 0.5rem;
        }
        .skeleton.text { height: 1rem; margin-bottom: 0.5rem; width: 100%; }
        .skeleton.title { height: 1.5rem; margin-bottom: 1rem; width: 50%; }
        .skeleton.avatar { height: 50px; width: 50px; border-radius: 50%; }
        .skeleton.card { height: 200px; width: 100%; }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
