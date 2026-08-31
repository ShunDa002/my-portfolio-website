> **Status: historical intent.** This PRD records what the portfolio was originally
> specified to be. It is retained for context and is *not* maintained.
>
> For current behavior, `openspec/specs/portfolio-site/` is the source of truth.
> Where this document and those specs disagree, the specs win. The reasoning behind
> each deliberate divergence from this PRD — no MDX pipeline, no shadcn UI, `mailto:`
> instead of clipboard copy — is recorded in the archived `document-portfolio-baseline`
> change under `openspec/changes/archive/`.

# Product Requirements Document (PRD)
## Portfolio Website for Software Engineering / AI Internship

**Product Name:** Personal Portfolio Website  
**Product Type:** Single-page developer portfolio  
**Primary Goal:** Secure a Software Engineering / AI Internship  
**Primary Audience:** Technical recruiters, engineering managers, AI/ML hiring teams  
**Positioning Statement:**  
> A product-minded engineer with full-stack development capability and specialized depth in AI, LLMs, Computer Vision, and Agentic AI systems.

---

## 1. Product Overview

### 1.1 Purpose

This portfolio website will serve as a high-impact personal branding and project showcase platform designed to help the candidate secure a **Software Engineering / AI Internship**.

The website should communicate three things immediately:

1. The candidate can build polished full-stack applications.
2. The candidate has practical AI/ML experience, especially in LLMs and Computer Vision.
3. The candidate understands product thinking, user value, and engineering execution.

The site will use a visually distinctive **Makoto Shinkai / CoMix Wave Films-inspired night-sky aesthetic**, combining cinematic backgrounds, glassmorphism UI, subtle animations, and highly readable content sections.

---

## 2. Goals and Success Metrics

### 2.1 Primary Goal

Increase recruiter and engineering manager confidence that the candidate is suitable for:

- Software Engineering Internship
- AI Engineering Internship
- Machine Learning Engineering Internship
- Full-stack AI Product Internship
- LLM / Agentic AI Internship
- Computer Vision Internship

### 2.2 Secondary Goals

- Present technical depth through project case studies.
- Demonstrate taste in UI/UX and frontend polish.
- Make it easy for recruiters to download the resume.
- Make it easy for visitors to contact the candidate.
- Support future expansion through MDX-powered content.

### 2.3 Success Metrics

| Metric | Target |
|---|---:|
| Recruiter understands candidate positioning | Within first 5 seconds |
| Resume download action visibility | Available in Hero section |
| Project section discoverability | Accessible from Hero CTA |
| Contact actions | Available at bottom of page |
| Lighthouse Performance | 85+ |
| Lighthouse Accessibility | 90+ |
| Mobile responsiveness | Fully supported |
| Time to interactive | Under 3 seconds on modern devices |
| Project case study scalability | New MDX project can be added without changing core layout |

---

## 3. Target Audience

### 3.1 Primary Users

#### Technical Recruiters

Recruiters are looking for:

- Clear internship fit
- Short, scannable summary
- Resume download
- Proof of technical projects
- LinkedIn and GitHub links
- Strong communication and presentation

#### Engineering Managers

Engineering managers are looking for:

- Real technical depth
- Evidence of full-stack capability
- AI/ML implementation experience
- Ability to explain technical decisions
- Product and user-impact thinking
- Clean engineering structure

### 3.2 User Needs

| User | Needs |
|---|---|
| Recruiter | Quickly understand role fit, skills, resume, and contact details |
| Engineering Manager | Evaluate project complexity, technologies used, and ownership |
| Peer / Collaborator | View GitHub, project demos, and technical interests |
| Future Candidate Self | Easily update content and projects over time |

---

## 4. Brand Positioning

### 4.1 Key Message

The candidate should be presented as:

> A Product-Minded Engineer who can build full-stack AI products using modern web technologies, LLMs, Computer Vision, and agentic systems.

### 4.2 Personality

The website should feel:

- Ambitious
- Calm
- Cinematic
- Intelligent
- Technical
- Elegant
- Imaginative
- Product-focused

### 4.3 Tone of Voice

The copy should be:

- Confident but not arrogant
- Technical but readable
- Concise but meaningful
- Recruiter-friendly
- Engineering-manager credible

---

## 5. Technical Stack

### 5.1 Framework

**Next.js 14+ with App Router**

Requirements:

- Use App Router structure.
- Prefer server components where appropriate.
- Use client components only for interactivity.
- Optimize static content and project pages.
- Support future deployment on Vercel.

### 5.2 Styling

**Tailwind CSS**

Requirements:

- Use Tailwind utility classes.
- Create reusable style patterns for glassmorphism cards.
- Maintain a consistent spacing scale.
- Use responsive design from mobile to desktop.
- Support dark visual system by default.

### 5.3 Component Library

**Shadcn UI**

Requirements:

- Use Shadcn UI as the base for buttons, cards, badges, toast, and layout primitives.
- Heavily customize for transparent surfaces.
- Override default solid backgrounds where necessary.
- Maintain accessibility of buttons, links, and interactive components.

### 5.4 Content Management

**MDX**

Purpose:

- Treat content as code.
- Allow rich project case studies in Markdown.
- Embed custom React components inside project writeups.
- Support future interactive components such as charts, diagrams, demos, or model result visualizations.

MDX content should support:

- Project title
- Summary
- Technologies
- Problem statement
- Solution
- Technical architecture
- Results
- Screenshots or visuals
- Links to GitHub, demo, or deployment
- Optional embedded React components

### 5.5 Animation

#### Background Animation

**react-tsparticles with tsparticles-slim**

Purpose:

- Add slow drifting star particles.
- Create subtle motion over the static night-sky background.
- Avoid excessive performance cost.

#### UI Animation

**framer-motion**

Purpose:

- Scroll-triggered fade-ins.
- Smooth section reveals.
- Subtle card hover effects.
- Reduced-motion support for accessibility.

---

## 6. Visual Design Requirements

### 6.1 Design Theme

The website will use a:

> Makoto Shinkai / CoMix Wave Films-inspired cinematic night sky aesthetic.

The design should evoke:

- Deep midnight skies
- Cinematic clouds
- Subtle glow
- Bioluminescent cyan highlights
- Countless stars
- Dreamlike atmosphere
- Quiet emotional depth

### 6.2 Color Palette

| Color Role | Hex | Usage |
|---|---:|---|
| Deep midnight background | `#020617` | Main page background |
| Slate overlay | `rgba(15, 23, 42, 0.4)` | Glass panels |
| Cyan accent | `#22d3ee` | Primary glow, highlights |
| Soft blue | `#38bdf8` | Secondary accent |
| White text | `#f8fafc` | Headings |
| Muted text | `#cbd5e1` | Body copy |
| Border glass | `rgba(255,255,255,0.12)` | Card borders |
| Soft glow | `rgba(34,211,238,0.35)` | Button/card glow |

### 6.3 Background Strategy

The visual background will use a hybrid three-layer approach.

#### Layer 1: Static Artistic Background

A high-fidelity static image should provide the main artistic atmosphere.

Requirements:

- Shinkai-style night sky
- Deep blue atmosphere
- Volumetric clouds
- Star-filled sky
- Subtle cyan lighting
- Optimized image size
- Responsive positioning
- Darkened where necessary for readability

Implementation expectation:

- Use a high-quality compressed image.
- Load as background image or optimized Next.js image.
- Avoid overly large assets that hurt performance.

#### Layer 2: Motion Particle Overlay

A lightweight particle system should create drifting stars.

Requirements:

- Slow motion only
- Low particle density on mobile
- Twinkling opacity
- Small particle size
- Cyan/white particle tones
- No distracting movement
- Reduced-motion support

#### Layer 3: Glassmorphism UI

All major content blocks should use dark glass panels.

Glassmorphism style:

```css
background: rgba(15, 23, 42, 0.4);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.12);
box-shadow: 0 0 40px rgba(34, 211, 238, 0.08);
```

---

## 7. Site Architecture

The website will be a **single-page scrolling experience** with five ordered sections:

1. Hero Section
2. About Me
3. My Skills
4. Featured Projects
5. Contact Me

Optional future expansion:

- Individual project case study pages
- Blog section
- Resume page
- Interactive AI demo section

---

## 8. Functional Requirements

### 8.1 Global Page Requirements

The entire website should be structured as a visually coherent single-page experience.

Requirements:

- The page must use smooth scrolling.
- Sections must be vertically stacked.
- Background must remain visually consistent across sections.
- Major sections should have clear spacing and hierarchy.
- The website must be responsive across mobile, tablet, desktop, and large desktop.
- Navigation may be minimal or sticky, but should not overpower the hero design.
- Content should remain readable over background image and particles.
- The site should support keyboard navigation.

---

## 9. Section Requirements

### 9.1 Section I: Hero Section

#### Purpose

Immediately communicate the candidate’s identity, specialization, and career target.

#### Content

**Headline:**

> Building the Brains of Tomorrow.

**Sub-headline:**

> Software Engineering Student specializing in AI, LLMs, and Computer Vision.

#### Calls to Action

1. **View Projects**
   - Primary CTA
   - Glow effect
   - Scrolls user to Featured Projects section

2. **Download Resume**
   - Secondary CTA
   - Glass outline style
   - Opens or downloads resume PDF

#### Layout Requirements

- Full viewport height or near-full viewport height.
- Centered hero content.
- Strong typographic hierarchy.
- Background image and particles visible behind content.
- Glass panel or soft text shadow should preserve readability.
- CTA buttons should be horizontally aligned on desktop.
- CTA buttons should stack on mobile.

#### Visual Requirements

- Headline should be large and cinematic.
- Cyan glow accent should appear around primary CTA.
- Sub-headline should use muted slate/white tone.
- Subtle fade-in animation on page load.

#### Acceptance Criteria

- User can understand candidate positioning within 5 seconds.
- “View Projects” scrolls correctly to projects section.
- “Download Resume” links to a resume file.
- Hero looks polished on mobile and desktop.

---

### 9.2 Section II: About Me

#### Purpose

Provide personal and academic context while reinforcing internship fit.

#### Content Requirements

The About section should mention:

- Academic background at **Universiti Malaysia Pahang Al-Sultan Abdullah**
- Interest in software engineering
- Passion for **FinTech**
- Passion for **Agentic AI**
- Motivation to build real-world AI products
- Product-minded engineering identity

#### Suggested Copy Direction

The writing should communicate that the candidate is not only interested in models and code, but also in building useful systems that solve real problems.

#### Layout Requirements

Two-column split:

| Left Column | Right Column |
|---|---|
| Profile picture | Narrative text |

Desktop:

- Profile image on the left.
- Text content on the right.

Mobile:

- Profile image stacked above text.
- Text centered or left-aligned depending on readability.

#### Profile Image Requirements

- Rounded corners or circular crop.
- Glass frame or subtle glowing border.
- Optimized with Next.js Image.
- Should work with dark background aesthetic.

#### Acceptance Criteria

- About section clearly explains who the candidate is.
- Academic background is visible.
- FinTech and Agentic AI interests are mentioned.
- Layout remains readable on mobile.

---

### 9.3 Section III: My Skills

#### Purpose

Give recruiters and engineering managers a fast, scannable overview of technical capabilities.

#### Format

Visual array of Shadcn UI badges grouped by category.

#### Skill Categories

**AI / ML**

- Python
- PyTorch
- LangChain
- Hugging Face
- OpenCV

**Web Development**

- Next.js
- React
- Tailwind CSS
- TypeScript

**DevOps / Tools**

- Docker
- Git
- Linux
- Supabase

#### Layout Requirements

- Use grouped sections or cards.
- Each category should have a clear label.
- Badges should wrap cleanly on smaller screens.
- Use transparent/glass badge styling.
- Highlight AI/ML skills subtly with cyan accents.

#### Visual Requirements

- Badges should feel lightweight and elegant.
- Hover state may add glow or border-color change.
- Category cards should use glassmorphism.

#### Acceptance Criteria

- All listed skills are visible.
- Skills are grouped into the correct categories.
- Badges are readable on dark background.
- Layout does not overflow on mobile.

---

### 9.4 Section IV: Featured Projects

#### Purpose

Demonstrate technical capability through substantial AI and full-stack projects.

#### Format

A responsive grid of three glass cards.

- Desktop: three columns if space allows.
- Tablet: two columns.
- Mobile: one column.

#### Project 1: Deepfake Detection Model

**Summary:**  
A Computer Vision project focused on detecting manipulated media using Vision Transformer fine-tuning and deployment through Hugging Face.

**Key Technical Elements:**

- Vision Transformer
- Fine-tuning
- Image classification
- Hugging Face deployment
- Model evaluation
- Computer Vision pipeline

**Recruiter Message:**  
Shows AI/ML specialization and ability to work with modern vision architectures.

#### Project 2: Malaysian History RAG

**Summary:**  
A Retrieval-Augmented Generation system designed to answer questions about Malaysian history using Qwen and vector embeddings.

**Key Technical Elements:**

- Retrieval-Augmented Generation
- Qwen
- Vector embeddings
- Document chunking
- Semantic search
- LLM response generation

**Recruiter Message:**  
Shows ability to build LLM applications with retrieval pipelines and domain-specific knowledge grounding.

#### Project 3: Financial MCP Server

**Summary:**  
An Agentic AI project using Model Context Protocol and `yfinance` to enable finance-related tool use and market data interaction.

**Key Technical Elements:**

- Model Context Protocol
- Agentic AI
- Tool calling
- `yfinance`
- Financial data
- Server-side architecture

**Recruiter Message:**  
Shows product-minded AI engineering with practical financial tooling and agent integration.

#### Project Card Requirements

Each card should include:

- Project title
- Short description
- Tech stack badges
- Project category
- Optional image or visual
- Link to case study
- Link to GitHub if available
- Optional live demo link

#### MDX Requirements

Projects should be powered by MDX content.

Each project file should include frontmatter similar to:

```mdx
---
title: "Deepfake Detection Model"
slug: "deepfake-detection-model"
description: "Vision Transformer fine-tuning for deepfake image detection."
category: "Computer Vision"
technologies:
  - Python
  - PyTorch
  - Vision Transformer
  - Hugging Face
featured: true
githubUrl: ""
demoUrl: ""
---
```

#### Acceptance Criteria

- Three featured projects display correctly.
- Project cards are visually consistent.
- Cards link to project case studies or placeholders.
- MDX content can be extended without modifying the main page manually.
- Project cards are responsive.

---

### 9.5 Section V: Contact Me

#### Purpose

Help recruiters and engineering managers contact the candidate quickly.

#### Components

- LinkedIn link
- GitHub link
- Email copy button
- Optional short closing message

#### Required Feature

A **Copy Email** button must copy the candidate’s email address to the clipboard.

After successful copy, the user should see a toast notification:

> Email copied to clipboard!

#### Contact Layout Requirements

- Centered card or compact section.
- Clear call to action.
- Links should be visually distinct.
- Icons may be used for LinkedIn and GitHub.
- Copy button should be accessible by keyboard.

#### Acceptance Criteria

- LinkedIn link opens correctly.
- GitHub link opens correctly.
- Copy Email button copies email to clipboard.
- Toast notification appears after copying.
- Contact section is easily visible at page bottom.

---

## 10. Content Requirements

### 10.1 Required Text Content

The website must include the following exact or near-exact text:

#### Hero

```text
Building the Brains of Tomorrow.
Software Engineering Student specializing in AI, LLMs, and Computer Vision.
```

#### Resume CTA

```text
Download Resume
```

#### Project CTA

```text
View Projects
```

#### Contact Toast

```text
Email copied to clipboard!
```

### 10.2 Writing Style

All content should be:

- Concise
- Technical
- Product-oriented
- Recruiter-friendly
- Clear to non-specialists
- Detailed enough for engineers

### 10.3 Project Case Study Writing Structure

Each MDX case study should follow this structure:

1. Overview
2. Problem
3. Solution
4. Technical Architecture
5. Implementation Details
6. Results or Evaluation
7. What I Learned
8. Links / Repository / Demo

---

## 11. Non-Functional Requirements

### 11.1 Performance

The site must be optimized for fast loading.

Requirements:

- Optimize background image.
- Use compressed image formats where possible.
- Avoid excessive particle density.
- Lazy-load below-the-fold content where appropriate.
- Avoid unnecessary client-side JavaScript.
- Use Next.js image optimization.
- Keep animation lightweight.

Targets:

- Lighthouse Performance score: 85+
- Initial page load under 3 seconds on modern broadband.
- No severe layout shift.

### 11.2 Accessibility

Requirements:

- Sufficient color contrast.
- Keyboard navigable buttons and links.
- Semantic HTML sections.
- Descriptive alt text for images.
- Accessible toast behavior.
- Visible focus states.
- Respect `prefers-reduced-motion`.

Target:

- Lighthouse Accessibility score: 90+

### 11.3 Responsiveness

The website must support:

- Mobile: 320px and above
- Tablet: 768px and above
- Desktop: 1024px and above
- Large desktop: 1440px and above

Responsive behavior:

- Hero CTA buttons stack on mobile.
- About section stacks on mobile.
- Project grid becomes single column on mobile.
- Skill badges wrap naturally.
- Text remains readable at all widths.

### 11.4 SEO

Requirements:

- Metadata title and description.
- Open Graph image.
- Semantic headings.
- Proper canonical URL if deployed.
- Descriptive project slugs.
- Structured content for project pages.

Suggested metadata:

```text
Title: Shonda Tay | Software Engineering & AI Portfolio
Description: Portfolio of a software engineering student specializing in AI, LLMs, Computer Vision, and full-stack product development.
```

### 11.5 Maintainability

Requirements:

- Use reusable components.
- Keep project data in MDX.
- Separate visual components from data-fetching logic.
- Avoid hard-coded project cards in the homepage where possible.
- Use clear folder structure.
- Use TypeScript types for project metadata.

---

## 12. Recommended Information Architecture

```text
app/
  page.tsx
  layout.tsx
  globals.css
  projects/
    [slug]/
      page.tsx

components/
  hero-section.tsx
  about-section.tsx
  skills-section.tsx
  projects-section.tsx
  project-card.tsx
  contact-section.tsx
  background/
    star-particles.tsx
    sky-background.tsx
  ui/
    shadcn components

content/
  projects/
    deepfake-detection-model.mdx
    malaysian-history-rag.mdx
    financial-mcp-server.mdx

lib/
  mdx.ts
  projects.ts
  utils.ts

public/
  images/
    background-night-sky.webp
    profile.jpg
  resume/
    resume.pdf
```

---

## 13. Component Requirements

### 13.1 HeroSection

Responsible for:

- Displaying headline
- Displaying sub-headline
- Rendering CTA buttons
- Triggering scroll to projects section
- Linking to resume

### 13.2 AboutSection

Responsible for:

- Displaying profile image
- Displaying personal narrative
- Reinforcing academic background and interests

### 13.3 SkillsSection

Responsible for:

- Rendering categorized skill badges
- Supporting responsive wrapping
- Using glass card containers

### 13.4 ProjectsSection

Responsible for:

- Fetching featured MDX projects
- Rendering project cards
- Linking to project detail pages

### 13.5 ProjectCard

Responsible for:

- Displaying project title
- Displaying summary
- Displaying tech badges
- Displaying category
- Rendering links

### 13.6 ContactSection

Responsible for:

- Rendering LinkedIn and GitHub links
- Copying email to clipboard
- Triggering toast notification

### 13.7 StarParticles

Responsible for:

- Initializing `tsparticles-slim`
- Rendering animated star overlay
- Reducing density for mobile
- Respecting reduced-motion settings

---

## 14. Development Workflow

The project should be built in two phases.

### Phase 1: The Visual Architect

#### Objective

Build the static UI only.

#### Scope

This phase focuses on:

- Layout
- Typography
- Glassmorphism
- Shadcn customization
- Responsive design
- Static project cards
- Static skill badges
- Static contact layout

#### Deliverables

- Single-page portfolio layout
- Hero section
- About section
- Skills section
- Featured projects section
- Contact section
- Static background image
- Glass UI system
- Responsive Tailwind layouts

#### Out of Scope

Do not implement yet:

- MDX pipeline
- Particles
- Framer Motion
- Clipboard copy
- Toast logic
- Dynamic project routing

#### Acceptance Criteria

- The website visually matches the intended aesthetic.
- All five sections are present.
- Layout is responsive.
- Static content is complete.
- UI is ready for logic integration.

### Phase 2: The System Architect

#### Objective

Implement interactivity, data pipeline, and animations.

#### Scope

This phase focuses on:

- `react-tsparticles` background
- MDX project data fetching
- Project detail pages
- Framer Motion scroll animations
- Clipboard copy feature
- Toast notification
- Resume download behavior
- SEO metadata
- Accessibility refinement
- Performance optimization

#### Deliverables

- Animated star background
- MDX-powered project cards
- Individual project case study pages
- Scroll-triggered animations
- Working email copy button
- Toast notification
- Optimized metadata
- Production-ready responsive website

#### Acceptance Criteria

- Project cards are generated from MDX.
- Particle animation runs smoothly.
- Animations do not hurt readability.
- Copy Email button works.
- Resume download works.
- Site is deployable.

---

## 15. User Stories

### Recruiter Stories

#### Story 1

As a recruiter, I want to quickly understand what role the candidate is targeting, so that I can evaluate internship fit.

**Acceptance Criteria:**

- Hero section clearly states software engineering and AI specialization.
- Resume button is visible.
- Skills are scannable.

#### Story 2

As a recruiter, I want to download the candidate’s resume, so that I can forward it internally.

**Acceptance Criteria:**

- Resume CTA is available in the hero.
- Resume file opens or downloads correctly.

### Engineering Manager Stories

#### Story 3

As an engineering manager, I want to review technical projects, so that I can assess the candidate’s practical ability.

**Acceptance Criteria:**

- Featured projects are easy to find.
- Each project has clear technical context.
- Project cards link to deeper case studies.

#### Story 4

As an engineering manager, I want to understand the candidate’s technical stack, so that I can evaluate fit for engineering work.

**Acceptance Criteria:**

- Skills are grouped by AI/ML, Web, and DevOps/Tools.
- Technologies are clearly visible.

### Candidate Maintenance Stories

#### Story 5

As the site owner, I want to add new projects using MDX, so that I can update my portfolio without rewriting homepage components.

**Acceptance Criteria:**

- New MDX files can be added under the project content folder.
- Project metadata automatically appears if marked as featured.
- Project content supports rich Markdown and embedded components.

---

## 16. Design System Requirements

### 16.1 Typography

Recommended style:

- Large expressive hero headline
- Clean sans-serif body text
- High contrast headings
- Muted body copy

Suggested hierarchy:

| Element | Style |
|---|---|
| Hero heading | `text-5xl` to `text-7xl` |
| Section heading | `text-3xl` to `text-5xl` |
| Body text | `text-base` to `text-lg` |
| Badge text | `text-xs` to `text-sm` |

### 16.2 Buttons

#### Primary Button

Used for:

- View Projects

Visual style:

- Cyan glow
- Strong contrast
- Rounded corners
- Hover glow increase

#### Secondary Button

Used for:

- Download Resume

Visual style:

- Transparent glass
- Light border
- Subtle hover background
- No heavy fill

### 16.3 Cards

Cards should use:

- Glass background
- Blur
- Thin border
- Soft shadow
- Rounded corners
- Hover elevation or glow
- Consistent padding

### 16.4 Badges

Badges should use:

- Transparent background
- Cyan or slate border
- Muted text
- Hover accent state
- Rounded pill shape

---

## 17. Animation Requirements

### 17.1 Page Load Animation

Hero content should fade in gently on initial load.

Suggested behavior:

- Opacity: 0 to 1
- Y-position: 20px to 0px
- Duration: 0.6s to 0.9s

### 17.2 Scroll Animation

Each section should animate into view.

Suggested behavior:

- Fade up
- Trigger once
- Avoid excessive movement

### 17.3 Card Hover Animation

Project cards may animate on hover.

Suggested behavior:

- Slight upward movement
- Border brightening
- Soft cyan glow

### 17.4 Reduced Motion

If the user has reduced-motion enabled:

- Disable or reduce particle movement.
- Remove scroll reveal movement.
- Keep simple opacity changes only.

---

## 18. Data Model

### 18.1 Project Metadata

Each project should have the following fields:

```ts
type Project = {
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  order?: number;
};
```

### 18.2 Skill Model

```ts
type SkillCategory = {
  title: string;
  skills: string[];
};
```

Example:

```ts
const skillCategories = [
  {
    title: "AI / ML",
    skills: ["Python", "PyTorch", "LangChain", "Hugging Face", "OpenCV"],
  },
  {
    title: "Web",
    skills: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "DevOps / Tools",
    skills: ["Docker", "Git", "Linux", "Supabase"],
  },
];
```

---

## 19. SEO and Metadata Requirements

### 19.1 Global Metadata

The website should include:

- Page title
- Description
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter card metadata
- Favicon
- Canonical URL after deployment

### 19.2 Suggested Metadata

```ts
export const metadata = {
  title: "Shonda Tay | Software Engineering & AI Portfolio",
  description:
    "Portfolio of a software engineering student specializing in AI, LLMs, Computer Vision, and full-stack product development.",
};
```

### 19.3 Project Metadata

Each project page should generate dynamic metadata based on MDX frontmatter.

Required:

- Project title
- Project description
- Project image if available
- Canonical project URL

---

## 20. Accessibility Requirements

The website must follow accessibility best practices.

Requirements:

- Use semantic HTML:
  - `main`
  - `section`
  - `nav`
  - `footer`
- Use proper heading order.
- Use descriptive alt text for profile image.
- Ensure buttons have clear labels.
- Ensure links have accessible names.
- Maintain color contrast over background.
- Provide visible focus states.
- Ensure toast does not block navigation.
- Support keyboard navigation.
- Respect reduced motion preferences.

---

## 21. Performance Requirements

### 21.1 Image Optimization

- Use WebP or AVIF where possible.
- Compress background image.
- Use responsive image sizes.
- Avoid loading oversized profile images.

### 21.2 JavaScript Optimization

- Keep particle system lightweight.
- Use `tsparticles-slim`, not the full package.
- Use client components only where needed.
- Avoid unnecessary third-party libraries.

### 21.3 Rendering Strategy

Recommended:

- Static generation for homepage.
- Static generation for project pages.
- MDX content processed at build time.

---

## 22. Security and Privacy Requirements

- Do not expose private email through insecure scripts beyond visible contact need.
- External links should use safe attributes:
  - `target="_blank"`
  - `rel="noopener noreferrer"`
- Clipboard access should only occur after user interaction.
- No unnecessary tracking scripts in initial version.
- If analytics are added later, use privacy-friendly configuration.

---

## 23. Deployment Requirements

Recommended deployment platform:

- Vercel

Deployment should support:

- Static rendering
- Next.js App Router
- Environment variables if needed later
- Custom domain
- Automatic deployments from GitHub

Pre-launch checklist:

- Resume file uploaded
- LinkedIn link updated
- GitHub link updated
- Email address updated
- Open Graph image added
- Background image optimized
- All links tested
- Mobile layout tested
- Lighthouse audit completed

---

## 24. Out of Scope for Initial Version

The following are not required for the first production release:

- Blog system
- CMS admin panel
- Authentication
- Real-time backend
- Database
- Comments
- Chatbot
- Analytics dashboard
- Multi-language support
- Dark/light theme toggle
- Complex 3D animations
- Heavy WebGL scenes

---

## 25. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Background image reduces readability | High | Use dark overlay and glass panels |
| Particles hurt performance | Medium | Use `tsparticles-slim` and low density |
| Website feels too artistic and not professional | Medium | Keep content concise and recruiter-focused |
| MDX pipeline increases complexity | Medium | Implement in Phase 2 only |
| Animations feel distracting | Medium | Keep motion subtle and support reduced motion |
| Project cards lack depth | High | Add MDX case studies with architecture and outcomes |
| Resume download link breaks | High | Add deployment checklist item |

---

## 26. Launch Criteria

The portfolio is ready for launch when:

- All five required sections are complete.
- Hero headline and sub-headline are present.
- Resume download works.
- Projects section includes the three required projects.
- Skills are grouped correctly.
- Contact links are working.
- Copy Email button works.
- Toast notification appears.
- Layout is responsive.
- Page performance is acceptable.
- Accessibility checks pass.
- Site can be deployed successfully.

---

## 27. MVP Definition

The MVP should include:

1. Single-page Next.js portfolio
2. Shinkai-style background image
3. Glassmorphism UI
4. Hero section
5. About Me section
6. Skills section
7. Three featured project cards
8. Contact section
9. Resume download button
10. LinkedIn and GitHub links
11. Copy Email button with toast
12. Responsive design

---

## 28. Future Enhancements

After the MVP, the portfolio can be expanded with:

- Interactive LLM demo
- Live RAG search demo
- Model performance visualizations
- Blog posts about AI/ML learning
- Project architecture diagrams
- GitHub contribution section
- Resume timeline
- Testimonials or recommendations
- Analytics for recruiter engagement
- Animated project walkthroughs
- Case study pages with embedded charts

---

## 29. Final Product Vision

The final website should feel like a polished, cinematic AI engineering portfolio that combines emotional visual storytelling with strong technical credibility.

The visitor should leave with this impression:

> This candidate can design, build, and explain modern AI-powered products — from beautiful frontend experiences to practical LLM and Computer Vision systems.
