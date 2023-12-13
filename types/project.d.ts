export type ProjectType = {
	name: string;
	description: string;
	icon: IconType;
	display?: DisplayType;
	details: ProjectOverviewType;
	accordion: AccordionType[];
	github?: GithubType;
};

export type ProjectOverviewType = {
	about: string;
	href?: string;
	tech: TechType[];
};

export type TechType = {
	name: string;
	icon: IconType;
};

export type AccordionType = {
	question: string;
	answer: string;
};

export type GithubType = {
	name: string;
	description: string;
	date: string;
	href: string;
	iconSrc: string;
};

export type DisplayType = {
	type: "image" | "video" | "iframe";
	src: string;
	alt: string;
	height: number;
	width: number;
};
