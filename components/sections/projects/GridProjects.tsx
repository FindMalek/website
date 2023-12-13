"use client";

import projects from "@/data/projects";
import Project from "@/components/sections/projects/Project";

export function GridProjects() {
	return (
		<div className="my-16 xl:max-w-none">
			<div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
				<div>
					{projects.slice(0, Math.ceil(projects.length / 2)).map((project) => (
						<Project
							key={project.name}
							project={project}
						/>
					))}
				</div>
				<div>
					{projects.slice(Math.ceil(projects.length / 2)).map((project) => (
						<Project
							key={project.name}
							project={project}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
