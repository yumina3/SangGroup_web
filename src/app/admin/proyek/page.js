import ProjectManager from "@/components/admin/ProjectManager";
import { requirePageUser } from "@/lib/auth/current-user";
import { listAllProjects } from "@/lib/services/projects";

export const metadata = { title: "Proyek" };
export const instant = false;

export default async function AdminProjectsPage() {
  await requirePageUser(["admin"]);
  const projects = await listAllProjects();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold">Proyek</h1>
        <p className="mt-1 text-[13px] text-ag-slate-secondary">
          Data proyek dipakai sebagai identitas listing dan halaman portofolio publik.
        </p>
      </div>
      <ProjectManager projects={projects} />
    </div>
  );
}
