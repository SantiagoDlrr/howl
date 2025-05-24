/*import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headers = new Headers();

  // Convert Node.js headers to fetch Headers
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      headers.append(key, value);
    } else if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    }
  }

  const context = await createTRPCContext({ headers });
  const caller = appRouter.createCaller(context);

  try {
    const insight = await caller.smartInsight.getClientInsight({ id: '1' });
    res.status(200).json(insight);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}*/