import { Suspense } from "react";
import { connection } from "next/server";

import { HeaderSkeleton, PanelSkeleton, StatGridSkeleton } from "@/components/dashboard/Skeletons";
import TaskWorkspace from "@/components/dashboard/tasks/TaskWorkspace";
import { getAgentTasks, taskHeaderDate } from "@/lib/dashboard/task-data";

export const metadata = { title: "Tugas Tindak Lanjut" };

/**
 * Tugas tindak lanjut dihitung dari waktu sekarang (label "Hari ini",
 * "Besok", "Terlambat"), jadi kontennya dialirkan di dalam <Suspense>.
 */
export const instant = false;

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <TasksContent />
    </Suspense>
  );
}

async function TasksContent() {
  await connection();

  const now = new Date();
  const { tasks, counts } = getAgentTasks(now);

  return <TaskWorkspace tasks={tasks} counts={counts} todayLabel={taskHeaderDate(now)} />;
}

function TasksSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <div className="mt-4 space-y-5">
        <StatGridSkeleton />
        <PanelSkeleton rows={5} />
      </div>
    </>
  );
}
