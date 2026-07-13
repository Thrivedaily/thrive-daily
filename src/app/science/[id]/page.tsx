import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { HABITS, getHabitById } from "@/data/habits";
import { Card, CardTitle } from "@/components/ui/card";
import { ScienceActions } from "./science-actions";

export function generateStaticParams() {
  return HABITS.map((h) => ({ id: h.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const habit = getHabitById(params.id);
  return {
    title: habit ? habit.name : "Science",
  };
}

export default function ScienceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const habit = getHabitById(params.id);
  if (!habit) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/science"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All science
      </Link>

      <div>
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
          {habit.category} · {habit.time}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{habit.name}</h1>
        <p className="mt-2 inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-sm font-semibold text-teal-700 dark:text-teal-300">
          +{habit.points} points
        </p>
      </div>

      <ScienceActions habitId={habit.id} />

      <Card className="space-y-2">
        <CardTitle>How to do it</CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {habit.howTo || "Follow the protocol name as written — consistency beats intensity."}
        </p>
      </Card>

      <Card className="space-y-2">
        <CardTitle>Why important</CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {habit.whyImportant ||
            "This habit supports energy, focus, or recovery as part of a complete daily stack."}
        </p>
      </Card>

      <Card className="space-y-2">
        <CardTitle>Detailed science</CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {habit.detailedScience ||
            "Evidence varies by habit; see external links for primary literature and reviews."}
        </p>
      </Card>

      {habit.links.length > 0 && (
        <Card className="space-y-3">
          <CardTitle>External links</CardTitle>
          <ul className="space-y-2">
            {habit.links.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-sm font-medium text-teal-700 break-all hover:underline dark:text-teal-300"
                >
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
