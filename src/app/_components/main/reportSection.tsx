import React from 'react';

interface Props {
  title: string;
  icon: React.ReactNode;
  content?: string;
  listItems?: string[];
}

export const ReportSection: React.FC<Props> = ({ title, icon, content, listItems }) => {
  return (
    <div className="bg-white rounded-md mb-6 p-4 shadow-sm border border-gray-100">
      <div className="flex items-center mb-3">
        <div className="bg-purple-100 p-2 rounded-md">{icon}</div>
        <h3 className="text-lg font-medium ml-2">{title}</h3>
        <span className="text-xs text-gray-400 ml-2">AI generated</span>
      </div>

      {content && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {content.startsWith('Neutral - Positivo:') ? (
            <>
              <span className="font-medium">Neutral - Positivo:</span> {content.replace('Neutral - Positivo:', '').trim()}
            </>
          ) : (
            content
          )}
        </p>
      )}

      {listItems && (
        <div
          className={
            typeof listItems[0] === 'string' && listItems[0].includes('.')
              ? 'text-sm text-gray-700'
              : 'space-y-2 text-sm text-gray-700 mt-2'
          }
        >
          {listItems.map((item, index) => (
            <p key={index} className="leading-relaxed">
              {typeof listItems[0] === 'string' && listItems[0].includes('.')
                ? item
                : `• ${item}`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};