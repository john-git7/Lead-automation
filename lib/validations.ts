import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Please provide a valid phone number").max(20),
  source: z.string().min(1, "Please select a source"),
});

export type LeadInput = z.infer<typeof leadSchema>;
