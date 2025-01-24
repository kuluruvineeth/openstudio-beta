import AppShell from "@/app/(organization)/minime/components/layout/app-shell";
import AppHeader from "@/app/(organization)/minime/components/layout/app-header";
import PostsFilter from "@/app/(organization)/minime/components/layout/posts-filter";
import NoProjectsPlaceholder from "@/app/(organization)/minime/components/projects/no-projects-placeholder";
import Project from "@/app/(organization)/minime/components/projects/project";
import CreateProject from "@/app/(organization)/minime/components/projects/project-create-button";
import { getProjects } from "@/actions/projects";
import { sortProjects } from "@/helper/utils";
import type { Metadata } from "next";

interface Props {
  searchParams: {
    published?: "true" | "false";
  };
}

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Projects({ searchParams: { published } }: Props) {
  const projects = await getProjects();
  const sortedProjects = sortProjects(projects, published);
  return (
    <AppShell>
      <AppHeader title="Projects">
        <CreateProject />
      </AppHeader>
      <PostsFilter segment="projects" current={published} />
      <div>
        {sortedProjects.map(({ password, ...rest }) => {
          const project = { ...rest, isProtected: !!password };

          return <Project project={project} key={project.id} admin />;
        })}
        {!sortedProjects.length && <NoProjectsPlaceholder description />}
      </div>
    </AppShell>
  );
}
