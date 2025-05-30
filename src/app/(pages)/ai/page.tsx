// app/settings/page.tsx (or pages/settings.tsx for Pages Router)
'use client';

import { useState } from 'react';
import AIProviderSettings from '../../_components/settings/AIProviderSettings';

export default function ai() {

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">System Settings</h1>
      {<AIProviderSettings />}
    </div>
  );
}

