import { z } from 'zod';

export const serviceRequestCreateSchema = z.object({
  veteranId: z.number().int().positive(),
  category: z.string().min(3).max(60),
  description: z.string().min(10).max(500),
  status: z.enum(['Open', 'In Progress', 'Closed']).optional()
});

export const serviceRequestUpdateSchema = serviceRequestCreateSchema.partial();
