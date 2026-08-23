export const profile = {
  name: "Aniket Bhattacharyea",
  initials: "AB",
  role: "Developer Relations & Technical Content",
  tagline: "Worry-free developer marketing",
  location: "Kolkata, India",
  timezone: "GMT+5:30",
  email: "aniket@abhattacharyea.dev",
  availability: "Booking new clients for Q4",
  socials: [
    { label: "GitHub", href: "https://github.com/heraldofsolace" },
    { label: "LinkedIn", href: "https://linkedin.com/in/heraldofsolace" },
  ],
};

export const stats = [
  { value: 5, suffix: "+", label: "Years as a developer" },
  { value: 3, suffix: "+", label: "Years in developer relations" },
  { value: 150, suffix: "+", label: "Technical articles shipped" },
  { value: 30, suffix: "+", label: "Clients served" },
];

export const services = [
  {
    index: "01",
    slug: "technical-content-writing",
    title: "Technical Content Writing",
    price: "$500 onwards",
    description:
      "SEO-friendly blog posts written for developers — complete with working code snippets, screenshots, and a demo application on GitHub.",
    tags: ["Blog posts", "Code snippets", "Demo repos"],
  },
  {
    index: "02",
    slug: "devrel-consulting",
    title: "DevRel Consulting",
    price: "$2,000 onwards",
    description:
      "I'll audit your product and DevRel strategy, build a content plan to engage developers, and execute it — articles, videos, and social posts included.",
    tags: ["Audit", "Strategy", "Content ops"],
  },
  {
    index: "03",
    slug: "content-planning-and-tech-reviewing",
    title: "Content Planning & Tech Reviewing",
    price: "$1,200 onwards",
    description:
      "Detailed outlines for blog posts and video scripts, plus technical review of your team's existing content to keep it accurate and engaging.",
    tags: ["Outlines", "Video scripts", "Tech review"],
  },
  {
    index: "04",
    slug: "software-development",
    title: "Software Development",
    price: "Custom pricing",
    description:
      "Custom software built for you — from internal tools and integrations to full product builds.",
    tags: ["Internal tools", "Integrations", "Custom builds"],
  },
  {
    index: "05",
    slug: "website-development",
    title: "Website Development",
    price: "$299 onwards",
    description:
      "A visually stunning, responsive website design and build for your business.",
    tags: ["Responsive design", "Marketing sites", "Web apps"],
  },
];

export type PricingTier = {
  label: string;
  price: string;
  description?: string;
  bullets?: string[];
};

export type ServiceDetail = {
  slug: string;
  overview: string[];
  requirements?: string[];
  deliverables?: string[];
  process?: string[];
  pricing: PricingTier[];
  note?: string;
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "technical-content-writing": {
    slug: "technical-content-writing",
    overview: [
      "Blog posts are one of the highest-trust channels for reaching developers — but only if they're technically accurate and clearly written. I bring 5+ years as a developer and 3+ years in developer relations to every article, so it reads like it was written by someone who's actually shipped the code.",
    ],
    requirements: [
      "Topic",
      "Content type",
      "Target audience",
      "Word count",
      "Deliverables",
      "Any other information",
      "Access to any paid tool you'd like used in the article",
    ],
    deliverables: [
      "Highly polished, technically accurate articles",
      "Screenshots and code samples where relevant",
      "A demo app and repo (tutorials & guides)",
      "Rough architecture diagrams on request",
    ],
    process: [
      "Submit your brief",
      "I confirm scope and timeline",
      "First draft delivered",
      "Up to three rounds of free revisions",
      "Final polish and publish-ready copy",
      "Invoice on delivery",
    ],
    pricing: [
      {
        label: "One-off",
        price: "$400",
        description: "Per 1,500–2,000 word article",
        bullets: ["20% off packages of 4+ articles"],
      },
      {
        label: "Monthly retainer",
        price: "$900+/mo",
        description: "2–4 articles per month",
        bullets: ["20% off 4+ month contracts"],
      },
    ],
    note: "Three revisions included. Changing the content type, switching tools, or requesting work outside the agreed scope isn't covered by revisions.",
  },
  "devrel-consulting": {
    slug: "devrel-consulting",
    overview: [
      "For teams that already have content and a strategy in place but want better results. I draw on 3+ years as a developer advocate to tailor a DevRel strategy to the audience you're actually trying to reach.",
    ],
    deliverables: [
      "A complete audit of your existing DevRel strategy",
      "Actionable steps to improve it",
      "A content strategy tailored to your audience",
      "Execution — articles, social posts, and video",
    ],
    pricing: [
      {
        label: "Retainer",
        price: "$2,000/mo",
        description:
          "Product + DevRel audit, an audience-based content strategy, 2 articles and one ~20-minute video every month.",
      },
      {
        label: "Additional articles",
        price: "$600",
        description: "Per 1,500–2,500 word piece ($325 per 1,000 words beyond that)",
      },
      {
        label: "Additional videos",
        price: "$800",
        description: "Per ~20-minute video",
      },
    ],
    note: "Billed monthly as work is delivered.",
  },
  "content-planning-and-tech-reviewing": {
    slug: "content-planning-and-tech-reviewing",
    overview: [
      "Already have a content writer and strategy in place, and just want someone to oversee the process? I'll plan the outlines and review the output so your content stays technically sound.",
    ],
    deliverables: [
      "Outlines for your writers to draft from",
      "Technical review of the final article so it's accurate and speaks to your audience",
    ],
    process: [
      "Pick a package and share the topic and details",
      "I create an outline for your approval, with revision rounds available",
      "Approved outline goes to your writing team",
      "You submit the completed article for review",
      "Up to three rounds of feedback — your writer implements the changes",
    ],
    pricing: [
      { label: "One-off", price: "$300", description: "Per article" },
      {
        label: "Package",
        price: "Custom",
        description:
          "4+ articles or videos with outline creation and review included — get in touch for details.",
      },
    ],
    note: "Language and grammar editing isn't included — just technical accuracy.",
  },
  "software-development": {
    slug: "software-development",
    overview: [
      "Custom software, built for you — from internal tools and integrations to full product builds.",
    ],
    pricing: [
      {
        label: "Custom pricing",
        price: "Get in touch",
        description:
          "Every build is scoped individually — tell me what you need and I'll put together a quote.",
      },
    ],
  },
  "website-development": {
    slug: "website-development",
    overview: [
      "A visually stunning, responsive website for your business — designed and built end to end.",
    ],
    requirements: [
      "Business details and the copy you want on the site",
      "Brand assets — logo, colors, fonts, imagery",
      "Any extras you need (product sales, appointment booking) — billed separately",
      "A domain, if you don't already have one (purchased separately)",
    ],
    deliverables: [
      "A responsive, 1–5 page website",
      "Contact forms and Google Maps integration",
      "Custom brand-matched design",
      "Ongoing hosting and support, from $50/month",
    ],
    pricing: [
      {
        label: "Build",
        price: "$299",
        description:
          "Custom 1–5 page site with contact forms, Google Maps integration, and custom brand design.",
        bullets: ["Extra for product sales, booking systems, forums, etc."],
      },
      {
        label: "Hosting & support",
        price: "$50+/mo",
        description: "Hosting, updates, and bug/issue support.",
        bullets: ["Domain purchased separately"],
      },
    ],
  },
};

export const clients = [
  "Fingerprint",
  "Bright Data",
  "Earthly",
  "FusionAuth",
  "JetBrains GoLand",
  "Dropbox Sign",
  "Loft Labs",
  "Tailscale",
  "Strapi",
  "ScrapingBee",
  "Prove",
  "Aviator",
  "Draft.dev",
  "Rewind",
  "StreamNative",
  "Clerk",
];

export type WorkItem = {
  index: string;
  title: string;
  client: string;
  type: "Tutorial" | "Guide" | "Roundup";
  date: string;
  href: string;
};

export const work: WorkItem[] = [
  {
    index: "01",
    title: "How to Generate a Browser Fingerprint in PHP",
    client: "Fingerprint",
    type: "Tutorial",
    date: "Jul 2025",
    href: "https://fingerprint.com/blog/browser-fingerprint-php/",
  },
  {
    index: "02",
    title: "How to Set Up Single Sign-On Between FusionAuth and WordPress",
    client: "FusionAuth",
    type: "Tutorial",
    date: "Jul 2025",
    href: "https://fusionauth.io/blog/how-to-set-up-single-sign-on-between-fusionauth-wordpress",
  },
  {
    index: "03",
    title: "Creating a G++ Makefile",
    client: "Earthly",
    type: "Tutorial",
    date: "Jul 2025",
    href: "https://earthly.dev/blog/g++-makefile/",
  },
  {
    index: "04",
    title: "Kubernetes Cost Monitoring With Kubecost",
    client: "Loft Labs",
    type: "Tutorial",
    date: "Jul 2025",
    href: "https://loft.sh/blog/kubernetes-cost-monitoring-with-kubecost",
  },
  {
    index: "05",
    title: "Build a Blog With Go Templates",
    client: "JetBrains GoLand",
    type: "Tutorial",
    date: "Jul 2025",
    href: "https://blog.jetbrains.com/go/2022/11/08/build-a-blog-with-go-templates/",
  },
  {
    index: "06",
    title: "Deploying and Scaling Strapi's Foodadvisor With Kubernetes & Docker",
    client: "Strapi",
    type: "Tutorial",
    date: "Aug 2025",
    href: "https://strapi.io/blog/deploying-and-scaling-the-official-strapi-demo-app-foodadvisor-with-kubernetes",
  },
  {
    index: "07",
    title: "Implementing RBAC in Kubernetes with FusionAuth",
    client: "FusionAuth",
    type: "Tutorial",
    date: "Aug 2025",
    href: "https://fusionauth.io/blog/rbac-with-kubernetes-fusionauth",
  },
  {
    index: "08",
    title: "Getting Started with an Internal Developer Portal",
    client: "Aviator",
    type: "Guide",
    date: "Aug 2025",
    href: "https://aviator.co/blog/getting-started-with-an-internal-developer-portal/",
  },
  {
    index: "09",
    title: "Web Scraping with Regex Guide",
    client: "Bright Data",
    type: "Guide",
    date: "Aug 2025",
    href: "https://brightdata.com/blog/web-data/web-scraping-with-regex",
  },
  {
    index: "10",
    title: "Next.js 13 Routes Part 1: Getting Started with Next.js API Routes",
    client: "Clerk",
    type: "Tutorial",
    date: "Aug 2025",
    href: "https://clerk.com/blog/next13-api-routes-1",
  },
];

export const posts = [
  {
    title: "Technical Writing Style Guide: Expert Tips",
    date: "Jul 2, 2025",
    href: "https://abhattacharyea.dev/blogs/wglxsfpnp9nexj0jflckcp8a",
  },
  {
    title: "Master Technical SEO Best Practices for Top Rankings",
    date: "Jul 21, 2025",
    href: "https://abhattacharyea.dev/blogs/oliao9d3rfkchj8y0g687zzx",
  },
  {
    title: "(Almost) Everything You Need to Know About Pointers in C",
    date: "Jul 21, 2025",
    href: "https://abhattacharyea.dev/blogs/qrb0v4aq2k6jkq3nzc3wcofg",
  },
  {
    title: "Make a Reddit Bot with Python",
    date: "Jul 24, 2025",
    href: "https://abhattacharyea.dev/blogs/fqkxa9e33immbzqrff5wwge5",
  },
];

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Writing", href: "/#writing" },
  { label: "Contact", href: "/#contact" },
];
