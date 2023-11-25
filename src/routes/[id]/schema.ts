import { z } from 'zod';

export const formSchema = z.object({
	file: z.any(),
	name: z.string().min(3).max(50),
	target: z.string().min(1),
	empty: z.enum(['drop', 'mean', 'median', 'mode']),
	categorical: z.enum(['onehot', 'ordinal', 'label', 'binary']),
	scale: z.enum(['standard', 'minmax', 'maxabs', 'robust', 'quantile'])
});

export type FormSchema = typeof formSchema;
