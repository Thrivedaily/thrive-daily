"use client";

import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const SCIENCE_POINTS = [
  {
    title: "Feel empowered and supported",
    body: "Psychological studies emphasize that feeling in control and connected boosts motivation. Your coach empowers you to take charge of your journey — while providing the support you need to succeed.",
  },
  {
    title: "Build lasting habits",
    body: "Forming new habits takes consistency, and research shows it's easier with external support. Your coach provides the structure and accountability to turn your goals into sustainable habits.",
  },
  {
    title: "Your investment fuels your commitment",
    body: "Behavioral science reveals that paying for a service increases your likelihood of sticking with it. When you invest in coaching, you're not just spending money — you're investing in your success.",
  },
  {
    title: "Clear goals + feedback = success",
    body: "Research proves that specific, challenging goals paired with consistent feedback drive better results. We help you set smart goals and provide the guidance you need to stay focused and make progress.",
  },
  {
    title: "You're more likely to follow through when someone's watching",
    body: "Studies show that people perform better when they know they're accountable to someone else. Your coach acts as a supportive partner, keeping you on track with regular check-ins and encouragement.",
  },
];

const BENEFITS = [
  {
    icon: Users,
    title: "Personalized expert oversight",
    body: "Ongoing check-ins, consistent encouragement, one-on-one guidance, and course-correction so momentum compounds.",
  },
  {
    icon: Target,
    title: "Faster goal achievement",
    body: "Cut months of trial and error. Focus on what actually moves the needle.",
  },
  {
    icon: ShieldCheck,
    title: "Structure & accountability",
    body: "Clear commitments and real check-ins so excellence becomes non-negotiable.",
  },
  {
    icon: LineChart,
    title: "Science-driven strategies",
    body: "Protocols and habits grounded in research, applied to your life with precision.",
  },
];

const COACHING_CTA =
  "mailto:info@thrivedaily.io?subject=Accountability%20Coaching%20—%20Get%20Coached&body=Hi%2C%20I'm%20ready%20for%20live%20accountability%20coaching%20with%20Thrive%20Daily.%0A%0AMy%20primary%20goal%3A%20";

function planCta(tier: string, price: string) {
  return `mailto:info@thrivedaily.io?subject=${encodeURIComponent(
    `Accountability Coaching — ${tier} Plan`
  )}&body=${encodeURIComponent(
    `Hi, I'm interested in the ${tier} plan ($${price}/month) for live accountability coaching with Thrive Daily.\n\nMy primary goal: `
  )}`;
}

const PRICING_TIERS = [
  {
    name: "Basic",
    price: 97,
    blurb: "Stay on track with lightweight weekly support.",
    features: [
      "Initial 30-minute goal-setting call",
      "Weekly text or email status update",
      "Follow-up support between updates",
    ],
    cta: "Choose Plan",
    featured: false,
  },
  {
    name: "Standard",
    price: 197,
    blurb: "Weekly live accountability to protect momentum.",
    features: [
      "Everything in Basic",
      "Weekly 15-minute accountability call",
      "Real-time course correction and encouragement",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Premium",
    price: 297,
    blurb: "Maximum structure for serious breakthroughs.",
    features: [
      "Everything in Standard",
      "3x weekly text check-ins",
      "Additional weekly progress & strategy call (30 min)",
    ],
    cta: "Choose Plan",
    featured: false,
  },
] as const;

export default function CoachingPage() {
  const { state } = useAppStore();
  const name = state.userName?.trim();

  return (
    <div className="space-y-8">
      {/* Hero — emotional, important, visual */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/25 bg-gradient-to-b from-teal-500/10 via-card to-card shadow-glow">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative space-y-5 p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
            Premium · Live human coaching
          </p>

          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 sm:aspect-[2/1]">
            <Image
              src="/coaching-hero.jpg"
              alt="A coach pushing an athlete to perform at their highest level"
              fill
              className="object-cover object-[center_20%]"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-xl font-bold leading-snug text-white drop-shadow-md sm:text-2xl md:text-3xl">
              Even the best need a coach.
            </p>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {name ? (
                <>
                  {name}, achieve{" "}
                  <span className="font-extrabold tracking-wide">YOUR</span> best
                  with a{" "}
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    Personal Accountability Coach
                  </span>
                </>
              ) : (
                <>
                  Achieve{" "}
                  <span className="font-extrabold tracking-wide">YOUR</span> best
                  with a{" "}
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    Personal Accountability Coach
                  </span>
                </>
              )}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Science-driven support so you reach your goals faster. Our coaches
              deliver tailored accountability to keep you focused, achieve faster
              results, and gain the confidence to succeed. Limited coaching spots
              available.
            </p>
          </div>

          <a
            href={COACHING_CTA}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-4 text-center text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-teal-600/30 transition hover:brightness-110 sm:text-lg"
          >
            Start Now
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Why this matters — systems quote */}
      <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-card to-emerald-500/5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-teal-600 p-2.5 text-white shadow-md shadow-teal-600/25">
            <Users className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">Why this matters for you right now</CardTitle>
            <blockquote className="mt-3 border-l-4 border-teal-500 pl-3 text-base font-medium leading-relaxed text-foreground sm:text-lg">
              &ldquo;You do not rise to the level of your goals. You fall to the
              level of your systems.&rdquo;
            </blockquote>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">
              — James Clear
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-teal-900 dark:text-teal-100">
              Knowledge isn&apos;t the bottleneck. Consistency is. A live coach
              turns your protocols, virtues, touchstones, and goals into a
              system someone will actually hold you to.
            </p>
          </div>
        </div>
      </Card>

      {/* Benefits — prominent cards */}
      <section className="space-y-4">
        <h2 className="text-center text-lg font-bold tracking-tight sm:text-left sm:text-xl">
          What you gain with live coaching
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <Card
              key={title}
              className="flex gap-3 border-teal-500/20 bg-card p-4 shadow-sm transition hover:border-teal-500/40 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bridge copy → Why it works */}
      <section className="space-y-5">
        <Card className="border-teal-500/25 bg-gradient-to-br from-teal-500/8 via-card to-emerald-500/8 px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-teal-800 dark:text-teal-200 sm:text-3xl">
            Got Goals?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Looking to lose weight, improve fitness, build lasting energy,
            advance your career, strengthen important relationships, pay off
            debt, complete a major project, or simply become the most
            disciplined version of yourself — a Personal Accountability Coach
            provides the expert guidance, structure, and consistent support you
            need to turn intentions into results. Many of our clients achieve
            breakthroughs they struggled with for years once they have someone
            in their corner holding them accountable.
          </p>
        </Card>

        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-balance text-teal-800 dark:text-teal-200 sm:text-3xl">
            The Science of Accountability — Why It Works
          </h2>
        </div>

        <ol className="space-y-3">
          {SCIENCE_POINTS.map((point, i) => (
            <Card
              key={point.title}
              className="flex gap-3 border-l-4 border-l-teal-500/80"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-sm font-bold text-teal-700 dark:text-teal-300">
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-teal-800 dark:text-teal-200">
                  {point.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {point.body}
                </p>
              </div>
            </Card>
          ))}
        </ol>

        <div className="flex justify-center">
          <a
            href={COACHING_CTA}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-teal-600/25 transition hover:bg-teal-500"
          >
            Get Coached
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* How it works — aligned with pricing tiers */}
      <Card className="space-y-4 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <CardTitle>How it works</CardTitle>
        </div>
        <ol className="space-y-3.5 text-sm leading-relaxed text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
              1
            </span>
            <span>
              <strong className="text-foreground">Choose your plan</strong> —
              Basic ($97), Standard ($197), or Premium ($297).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
              2
            </span>
            <span>
              <strong className="text-foreground">
                Start with your goal-setting call
              </strong>{" "}
              — every plan includes an initial 30-minute session to clarify
              goals, map your Thrive Daily stack, and set clear commitments.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
              3
            </span>
            <span>
              <strong className="text-foreground">
                Get the support your tier includes
              </strong>{" "}
              — weekly updates, check-ins, and calls based on the plan you chose.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
              4
            </span>
            <span>
              <strong className="text-foreground">Show up and execute</strong> —
              your coach holds the structure so you stay consistent, course-correct
              quickly, and compound results week after week.
            </span>
          </li>
        </ol>
        <p className="text-sm font-semibold text-foreground">
          Ready? Choose a plan below — we&apos;ll take it from there.
        </p>
      </Card>

      {/* Pricing tiers */}
      <section className="space-y-5">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-600 dark:text-teal-400">
            Simple pricing
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Pricing Tiers
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            All tiers include an initial{" "}
            <span className="font-semibold text-foreground">
              30-minute goal-setting call
            </span>
            .
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative flex flex-col p-5",
                tier.featured
                  ? "border-teal-500/50 bg-gradient-to-b from-teal-500/15 via-card to-card shadow-lg shadow-teal-500/15 ring-1 ring-teal-500/30"
                  : "border-border"
              )}
            >
              {tier.featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                  {tier.name}
                </p>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{tier.blurb}</p>
              </div>
              <ul className="mt-4 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm leading-snug"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={planCta(tier.name, String(tier.price))}
                className={cn(
                  "mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition",
                  tier.featured
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/25 hover:brightness-110"
                    : "border border-teal-500/40 bg-teal-500/10 text-teal-800 hover:bg-teal-500/15 dark:text-teal-200"
                )}
              >
                {tier.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* Final push CTA */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 px-5 py-8 text-center text-white shadow-xl shadow-teal-700/30 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-100">
          Your next level is a decision away
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          Stop carrying the load alone.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-teal-50/90 sm:text-base">
          Champions have coaches. So can you. Get expert guidance, real
          accountability, and the structure that turns intention into identity.
        </p>
        <a
          href={COACHING_CTA}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-teal-800 shadow-lg transition hover:bg-teal-50"
        >
          Start Now — Get Coached
          <ArrowRight className="h-5 w-5" />
        </a>
        <p className="mt-3 text-xs text-teal-100/80">
          Premium live coaching · Reply within 1–2 business days
        </p>
      </section>

    </div>
  );
}
