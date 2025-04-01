import React from 'react';

interface LookerDashboardProps {
  dashboardUrl: string;
  title?: string;
  height?: string;
}

const LookerDashboard: React.FC<LookerDashboardProps> = ({ 
  dashboardUrl, 
  title = 'Dashboard', 
  height = '600px' 
}) => {
  return (
    <div className="w-full h-full shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-50">{title}</h2>
      <div className="w-full" style={{ height }}>
        <iframe 
          src={dashboardUrl}
          className="w-full h-full border-0"
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );
};

export default LookerDashboard;