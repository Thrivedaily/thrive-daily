import { CATEGORIES, HABITS } from "@/data/habits";
import { HEALTHY_HABIT_CATEGORIES, HEALTHY_HABITS } from "@/data/healthyHabits";
import { TOUCHSTONES } from "@/data/touchstones";
import type {
  AppState,
  CustomHealthyHabit,
  CustomProtocol,
  CustomTouchstone,
  Habit,
  HealthyHabitGuideItem,
} from "@/lib/types";
import type { Touchstone } from "@/data/touchstones";

export type ProtocolItem = Habit & { isCustom?: boolean };

export type HealthyHabitItem = HealthyHabitGuideItem & { isCustom?: boolean };

export type TouchstoneItem = Touchstone & { isCustom?: boolean };

function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

function healthyCategoryLabel(key: string): string {
  return (
    HEALTHY_HABIT_CATEGORIES.find((c) => c.key === key)?.label ?? key
  );
}

/** Merge saved order with defaults + customs (unknown ids dropped, new ids appended) */
export function mergeOrder(
  defaultIds: string[],
  customIds: string[],
  savedOrder: string[] | undefined
): string[] {
  const allowed = new Set([...defaultIds, ...customIds]);
  const fromSaved = (savedOrder || []).filter((id) => allowed.has(id));
  const seen = new Set(fromSaved);
  const rest = [...defaultIds, ...customIds].filter((id) => !seen.has(id));
  return [...fromSaved, ...rest];
}

export function resolveProtocols(state: Pick<
  AppState,
  "customProtocols" | "protocolOrder"
>): ProtocolItem[] {
  const customs = state.customProtocols || [];
  const customById = new Map(customs.map((c) => [c.id, c]));
  const defaultIds = HABITS.map((h) => h.id);
  const customIds = customs.map((c) => c.id);
  const order = mergeOrder(defaultIds, customIds, state.protocolOrder);

  const defaultById = new Map(HABITS.map((h) => [h.id, h]));
  const items: ProtocolItem[] = [];

  order.forEach((id, index) => {
    const def = defaultById.get(id);
    if (def) {
      items.push({ ...def, order: index + 1, isCustom: false });
      return;
    }
    const c = customById.get(id);
    if (c) {
      items.push(customProtocolToHabit(c, index + 1));
    }
  });

  return items;
}

export function customProtocolToHabit(
  c: CustomProtocol,
  order: number
): ProtocolItem {
  return {
    id: c.id,
    name: c.name,
    points: Math.max(0, Math.floor(c.points) || 0),
    categoryKey: c.categoryKey,
    category: categoryLabel(c.categoryKey),
    time: c.time || "Anytime",
    order,
    howTo: "Your personalized protocol.",
    whyImportant: "A habit you added to fit your goals.",
    detailedScience: "",
    links: [],
    isCustom: true,
  };
}

export function resolveHealthyHabits(state: Pick<
  AppState,
  "customHealthyHabits" | "healthyHabitOrder"
>): HealthyHabitItem[] {
  const customs = state.customHealthyHabits || [];
  const customById = new Map(customs.map((c) => [c.id, c]));
  const defaultIds = HEALTHY_HABITS.map((h) => h.id);
  const customIds = customs.map((c) => c.id);
  const order = mergeOrder(defaultIds, customIds, state.healthyHabitOrder);
  const defaultById = new Map(HEALTHY_HABITS.map((h) => [h.id, h]));
  const items: HealthyHabitItem[] = [];

  order.forEach((id, index) => {
    const def = defaultById.get(id);
    if (def) {
      items.push({ ...def, order: index + 1, isCustom: false });
      return;
    }
    const c = customById.get(id);
    if (c) {
      items.push({
        id: c.id,
        name: c.name,
        categoryKey: c.categoryKey,
        category: healthyCategoryLabel(c.categoryKey),
        science: c.science || "A habit you added for your wellness focus.",
        order: index + 1,
        isCustom: true,
      });
    }
  });

  return items;
}

export function resolveTouchstones(state: Pick<
  AppState,
  "customTouchstones" | "touchstoneOrder"
>): TouchstoneItem[] {
  const customs = state.customTouchstones || [];
  const customById = new Map(customs.map((c) => [c.id, c]));
  const defaultIds = TOUCHSTONES.map((t) => t.id);
  const customIds = customs.map((c) => c.id);
  const order = mergeOrder(defaultIds, customIds, state.touchstoneOrder);
  const defaultById = new Map(TOUCHSTONES.map((t) => [t.id, t]));
  const items: TouchstoneItem[] = [];

  order.forEach((id, index) => {
    const def = defaultById.get(id);
    if (def) {
      items.push({ ...def, order: index + 1, isCustom: false });
      return;
    }
    const c = customById.get(id);
    if (c) {
      items.push({
        id: c.id,
        title: c.title,
        description: c.description || "",
        order: index + 1,
        isCustom: true,
      });
    }
  });

  return items;
}

export function moveIdInOrder(
  order: string[],
  id: string,
  direction: "up" | "down"
): string[] {
  const i = order.indexOf(id);
  if (i < 0) return order;
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= order.length) return order;
  const next = [...order];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function newCustomId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export function maxDailyProtocolPoints(
  protocols: { points: number }[]
): number {
  return protocols.reduce((s, h) => s + (h.points || 0), 0);
}

export type { CustomProtocol, CustomHealthyHabit, CustomTouchstone };
