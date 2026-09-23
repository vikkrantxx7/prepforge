import type { Topic } from "@prepforge/shared";

export const topicsStore = new Map<string, Topic>();

const id = crypto.randomUUID();
topicsStore.set(id, {
	id,
	name: "Sample Topic",
	slug: "sample-topic",
	description: "This is a sample topic.",
	category: "Javascript",
	createdAt: new Date().toISOString(),
});
