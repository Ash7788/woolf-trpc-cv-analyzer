
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
export const publicProcedure = t.procedure;
export const router = t.router;
import { analyzeRoute } from './routes/analyze';

export const appRouter = router({
  analyze: analyzeRoute,
});

export type AppRouter = typeof appRouter;