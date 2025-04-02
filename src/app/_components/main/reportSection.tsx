import React from 'react';

interface Props {
  title: string;
  icon: React.ReactNode;
  content?: string;
  listItems?: string[];
}

export const ReportSection: React.FC<Props> = ({ title, icon, content, listItems }) => {
  return (
    <div className="bg-white rounded-md mb-6 p-5 shadow-sm border border-gray-100">
      <div className="flex items-start mb-4">
        <div className="bg-purple-100 p-2 rounded-md">{icon}</div>
        <div className="ml-3 flex flex-col justify-center">
          <h3 className="text-lg font-medium leading-tight">{title}</h3>
          <span className="text-xs text-gray-400 mt-0.5">AI generated</span>
        </div>
      </div>

      {content && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {content.startsWith('Neutral - Positivo:') ? (
            <>
              <span className="font-medium">Neutral - Positivo:</span>{' '}
              {content.replace('Neutral - Positivo:', '').trim()}
            </>
          ) : (
            content
          )}
        </p>
      )}

      {listItems && (
        <div className="text-sm text-gray-700 mt-3">
          {listItems.map((item, index) => (
            <p key={index} className="leading-relaxed mb-2">
              {typeof listItems[0] === 'string' && listItems[0].includes('.') ? item : `• ${item}`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};