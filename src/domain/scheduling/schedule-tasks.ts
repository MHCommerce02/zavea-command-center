import { ScheduleItem, Task } from "../entities";

export interface FixedBlock {
  id: string;
  title: string;
  startMinutes: number; // minutes since midnight
  endMinutes: number;
}

export const WORK_START = 9 * 60; // 09:00
export const WORK_END = 17 * 60; // 17:00

/**
 * Ported unchanged from the Phase 1 prototype's scheduleTasks(). Places
 * tasks (already sorted by priority, highest first) into the first
 * available slot, pushing past any fixed block a task would otherwise
 * overlap or run through. This is the same slot-finding algorithm that
 * schedule_blocks' EXCLUDE constraint backs at the database level — this
 * client-side copy exists so a task that hasn't been persisted into
 * scheduled_tasks yet (e.g. freshly created from a new recommendation) can
 * still render in a sane position before the next schedule_run happens.
 */
export function scheduleTasks(
  tasks: Task[],
  fixedBlocks: FixedBlock[],
  startMinutes: number = WORK_START
): { taskId: string; startMinutes: number; endMinutes: number }[] {
  const sortedBlocks = [...fixedBlocks].sort((a, b) => a.startMinutes - b.startMinutes);
  let cursor = startMinutes;
  const placements: { taskId: string; startMinutes: number; endMinutes: number }[] = [];

  for (const task of tasks) {
    let moved = true;
    while (moved) {
      moved = false;
      for (const block of sortedBlocks) {
        const overlaps = cursor < block.endMinutes && cursor + task.estimatedMinutes > block.startMinutes;
        if (overlaps) {
          cursor = block.endMinutes;
          moved = true;
        }
      }
    }
    placements.push({ taskId: task.id, startMinutes: cursor, endMinutes: cursor + task.estimatedMinutes });
    cursor += task.estimatedMinutes;
  }

  return placements;
}

function minutesToIsoToday(minutes: number): string {
  const d = new Date();
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return d.toISOString();
}

/**
 * Merges already-persisted scheduled_tasks + fixed_calendar_events (read
 * from Supabase) into one chronological timeline. Any task that has no
 * persisted placement yet is run through scheduleTasks() as a fallback so
 * the UI never has to invent an arbitrary sort order.
 */
export function buildTimeline(
  scheduledPlacements: { task: Task; start: string; end: string }[],
  unscheduledTasks: Task[],
  fixedEvents: { id: string; title: string; start: string; end: string }[]
): ScheduleItem[] {
  const items: ScheduleItem[] = [];

  for (const p of scheduledPlacements) {
    items.push({ kind: "task", id: p.task.id, title: p.task.title, start: p.start, end: p.end, task: p.task });
  }

  for (const e of fixedEvents) {
    items.push({ kind: "locked", id: e.id, title: e.title, start: e.start, end: e.end });
  }

  if (unscheduledTasks.length > 0) {
    const fixedBlocks: FixedBlock[] = fixedEvents.map((e) => {
      const s = new Date(e.start);
      const en = new Date(e.end);
      return {
        id: e.id,
        title: e.title,
        startMinutes: s.getHours() * 60 + s.getMinutes(),
        endMinutes: en.getHours() * 60 + en.getMinutes(),
      };
    });
    const placements = scheduleTasks(unscheduledTasks, fixedBlocks);
    for (const placement of placements) {
      const task = unscheduledTasks.find((t) => t.id === placement.taskId)!;
      items.push({
        kind: "task",
        id: task.id,
        title: task.title,
        start: minutesToIsoToday(placement.startMinutes),
        end: minutesToIsoToday(placement.endMinutes),
        task,
      });
    }
  }

  return items.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
