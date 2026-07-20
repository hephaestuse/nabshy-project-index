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
    return <p className="admin-panel admin-panel-pad text-sm text-black/65">No projects.</p>;
  }

  return (
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>English title</th>
            <th>Developer</th>
            <th>Usage</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className={project.isActive ? "" : "bg-black/4 text-black/55"}
            >
              <td>{project.titleFa}</td>
              <td>{project.titleEn}</td>
              <td>{project.developerNameEn}</td>
              <td>{project.usageEn}</td>
              <td>{project.sortOrder}</td>
              <td><span className="text-xs font-bold uppercase tracking-[0.06em]">{project.isActive ? "Active" : "Inactive"}</span></td>
              <td className="flex min-w-[19rem] flex-wrap gap-2">
                <Link href={`/admin/projects/${project.id}/edit`} className="admin-table-action">
                  Edit
                </Link>
                <form action={moveProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" className="admin-table-action">Move up</button>
                </form>
                <form action={moveProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" className="admin-table-action">Move down</button>
                </form>
                <form action={toggleProjectActiveAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <button type="submit" className="admin-table-action">
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
