import React from 'react';

const Logo = ({ className = "h-8 w-auto", showText = false }) => {
  return (
    <div className="flex items-center space-x-2.5">
      <img 
        src="/srm-logo-clean.svg" 
        alt="SRM IST Logo" 
        className={`${className} object-contain filter drop-shadow-sm`}
        onError={(e) => {
          e.target.src = '/srm-logo.svg';
        }}
      />
      {showText && (
        <div className="flex flex-col">
          <span className="text-white text-sm font-bold leading-tight tracking-wide">SRM IST</span>
          <span className="text-brand-gold text-[9px] font-semibold tracking-widest uppercase">IQAC CELL</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
