import { z } from 'zod';

export const modelSchema = z.object({
	name: z.string().min(1),
	model: z.enum([
		'Ordinary Least Squares',
		'Elastic Net',
		'Logistic Regression',
		'Gradient Descent',
		'Decision Tree',
		'Support Vector Machine'
	]),
	test_size: z.coerce.number().min(0).max(1),
	alpha: z.coerce.number().min(0).optional(),
	l1_ratio: z.coerce.number().min(0).max(1).optional(),
	max_iter: z.coerce.number().min(1).optional(),
	tol: z.coerce.number().min(0).optional(),
	C: z.coerce.number().min(0).optional(),
	loss: z.optional(
		z.enum([
			'hinge',
			'huber',
			'log_loss',
			'squared_hinge',
			'perceptron',
			'epsilon_insensitive',
			'squared_epsilon_insensitive'
		])
	),
	shuffle: z.boolean().optional(),
	learning_rate: z.enum(['constant', 'optimal', 'invscaling', 'adaptive']).optional(),
	early_stopping: z.boolean().optional(),
	validation_fraction: z.coerce.number().min(0).max(1).optional(),
	criterion: z.enum(['gini', 'entropy', 'log_loss']).optional(),
	max_depth: z.coerce.number().min(0).optional(),
	min_samples_split: z.coerce.number().min(0).optional(),
	min_samples_leaf: z.coerce.number().min(0).optional(),
	max_features: z.enum(['auto', 'sqrt', 'log2']).optional(),
	max_leaf_nodes: z.coerce.number().min(0).optional(),
	kernel: z.enum(['linear', 'poly', 'rbf', 'sigmoid']).optional(),
	degree: z.coerce.number().min(0).optional(),
	gamma: z.enum(['scale', 'auto']).optional()
});

export type ModelSchema = typeof modelSchema;
