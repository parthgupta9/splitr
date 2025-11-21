import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex justify-center pt-40">
      {children}
    </div>
  );
};

export default Layout;