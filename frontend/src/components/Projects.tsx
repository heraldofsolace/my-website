"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { usePersona } from "@/lib/persona";
import { strapiMediaUrl, type ProjectData } from "@/lib/strapi";

// Software portfolio — apps, tools, open source work. Separate from Work.tsx
// ("Selected Work", the blog-portfolio content-writing list) since these
// need fields that content pieces don't: tech stack, repo/live links, a
// screenshot. Devrel persona only — the math persona doesn't claim a
// software-development identity anywhere else on the site.
export default function Projects({ projects }: { projects: ProjectData[] }) {
  const { persona } = usePersona();
  if (persona !== "devrel") return null;
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="border-t border-line px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Software Projects
        </span>
        <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Things I&rsquo;ve built.
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal
              key={project.documentId}
              delay={Math.min(i * 0.06, 0.3)}
              className="h-full"
            >
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectData }) {
  // tech_stack is a Strapi `json` field — no schema-level shape guarantee,
  // so guard it at runtime rather than trusting the (untyped) generated type.
  const techStack = Array.isArray(project.tech_stack)
    ? (project.tech_stack as unknown[]).filter((t): t is string => typeof t === "string")
    : [];

  const image = project.image;
  const imageUrl = image
    ? strapiMediaUrl(image.formats?.medium?.url ?? image.formats?.small?.url ?? image.url)
    : null;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-soft">
      {imageUrl ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        // Placeholder for projects without a screenshot yet — keeps card
        // heights consistent across a mixed grid instead of only some
        // cards having an image block.
        <div aria-hidden className="flex aspect-video items-center justify-center bg-bg">
          <span className="font-display text-3xl text-line">{"</>"}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-xl font-medium tracking-tight">
          {project.title}
        </h3>
        <p className="flex-1 text-sm text-muted">{project.description}</p>

        {techStack.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {(project.github_url || project.live_url) && (
          <div className="mt-1 flex gap-5 font-mono text-xs uppercase tracking-widest">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                GitHub →
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                Live →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
