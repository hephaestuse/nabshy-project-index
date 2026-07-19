import Link from "next/link";
import {
  moveProjectAction,
  toggleProjectActiveAction,
} from "@/actions/admin-project.actions";

type AdminProjectRow = {
  id: string;
  titleFa: string;
  titleEn: string;
  developerNameEn: string;
  usageEn: string;
  sortOrder: number;
  isActive: boolean;
};

export function ProjectTable({ projects }: { projects: AdminProjectRow[] }) {
  if (projects.length === 0) {
    return <p className="border border-[#071A33]/15 bg-white p-5">No projects.</p>;
  }

  return (
    <div className="overflow-x-auto border border-[#071A33]/15 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-[#f7f5f0] text-left">
          <tr>
            <th className="p-3">Project</th>
            <th className="p-3">English title</th>
            <th className="p-3">Developer</th>
            <th className="p-3">Usage</th>
            <th className="p-3">Order</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className={project.isActive ? "border-t" : "border-t bg-[#f7f5f0]"}
            >
              <td className="p-3">{project.titleFa}</td>
              <td className="p-3">{project.titleEn}</td>
              <td className="p-3">{project.developerNameEn}</td>
              <td className="p-3">{project.usageEn}</td>
              <td className="p-3">{project.sortOrder}</td>
              <td className="p-3">{project.isActive ? "Active" : "Inactive"}</td>
              <td className="flex flex-wrap gap-2 p-3">
                <Link href={`/admin/projects/${project.id}/edit`} className="underline">
                  Edit
                </Link>
                <form action={moveProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" className="underline">Move up</button>
                </form>
                <form action={moveProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" className="underline">Move down</button>
                </form>
                <form action={toggleProjectActiveAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <button type="submit" className="underline">
                    {project.isActive ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
