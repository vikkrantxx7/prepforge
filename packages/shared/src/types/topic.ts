export type Topic = {
	id: string;
	name: string;
	slug: string;
	description: string;
	category: string;
	createdAt: string;
	updatedAt?: string;
	// TODO: add createdBy (userId) in Week 2
};
