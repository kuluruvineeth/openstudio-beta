import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { AnalyticsBadge } from "../analytics/analytics-badge";
import { Icons } from "@repo/design-system/components/ui/icons";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Project as ProjectType } from "@/helper/utils";
interface Props {
  admin?: boolean;
  project: Pick<
    ProjectType,
    "id" | "title" | "year" | "description" | "slug" | "views" | "published"
  > & {
    isProtected: boolean;
  };
}

export default function Project({ project, admin }: Props) {
  const isPublished = project.published;
  return (
    <div className="-mx-2 flex relative min-h-5  max-md:h-auto group items-center justify-between rounded-md  p-2 text-sm transition-colors  hover:bg-gray-3 max-md:flex-col max-md:items-start">
      <Link
        href={`/minime/projects/${admin ? project.id : project.slug}`}
        className="absolute left-0 top-0 w-full py-2 h-full"
        aria-label={`${project.title}`}
      />
      <div className="flex-1 flex gap-1   items-start max-md:flex-col">
        <span className="w-10 text-gray-4 truncate group-hover:text-secondary transition-colors text-left">
          {project.year}
        </span>
        <div className="w-full  flex flex-1  flex-col">
          <h5>
            <Balancer>{project.title}</Balancer>
          </h5>
          <p className="text-gray-4 text-xs">{project?.description}</p>
        </div>
      </div>

      <div className="max-md:w-full max-md:mt-2 flex items-center justify-end z-10">
        <div className="flex items-center gap-1">
          {project.isProtected && (
            <Badge className="h-4 py-2 px-1 hover:bg-gray-2 flex font-normal items-center gap-1 cursor-default">
              <Icons.locked size={14} /> Locked
            </Badge>
          )}
          {admin && (
            <>
              <Link
                href={`/minime/projects?published=${isPublished ? "true" : "false"}`}
              >
                <Badge className="h-4 py-2 px-1 hover:bg-gray-2 font-normal">
                  {isPublished ? "Public" : "Draft"}
                </Badge>
              </Link>

              <AnalyticsBadge
                href={`/minime/projects/${project.id}/analytics`}
                value={project.views ?? 0}
                published={project.published ?? false}
                index="views"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
