# portfolio-site/skills Specification

## Purpose

Gives a recruiter a five-second read of the owner's technical range, grouped so that AI depth, full-stack capability, and operational tooling can each be assessed separately.

## Requirements

### Requirement: Skills section is anchor-addressable

The skills section SHALL be reachable by the navigation's "Skills" link and SHALL carry a stable anchor identifier.

#### Scenario: Visitor jumps to Skills

- **WHEN** a visitor activates the "Skills" navigation link
- **THEN** the viewport moves to the skills section

### Requirement: Section introduction

The skills section SHALL open with a centered heading and a one-line statement framing the listed tools as the means of building intelligent, scalable software, so the list reads as capability rather than as a keyword dump.

#### Scenario: Recruiter reaches the skills section

- **WHEN** the section renders
- **THEN** a heading and a single framing sentence appear above the groups

### Requirement: Three skill groups

Skills SHALL be presented in exactly three labelled groups, in this order: "AI & Computer Vision", "Full Stack Web", and "DevOps & Cloud". Each group label SHALL be rendered in the cyan accent with an underline rule so groups are visually separable at a glance.

#### Scenario: Engineering manager assesses stack fit

- **WHEN** an engineering manager scans the section
- **THEN** three distinctly labelled groups are visible in the stated order
- **AND** each label is visually separated from the entries beneath it

### Requirement: Group membership

The AI and Computer Vision group SHALL contain Python, PyTorch, LangChain, Hugging Face, and OpenCV. The Full Stack Web group SHALL contain Next.js, React, TypeScript, and Tailwind CSS. The DevOps and Cloud group SHALL contain Docker, Git, Linux, and Supabase. No entry SHALL appear in more than one group.

#### Scenario: Visitor reads each group

- **WHEN** the section renders
- **THEN** all thirteen named entries are present, each in its stated group, with no duplicates

### Requirement: Skill entries render as icon pills

Each skill SHALL render as a glass pill pairing the technology's brand mark with its name. On hover, a pill SHALL brighten its border toward the cyan accent, tint its mark to the accent, and brighten its label.

#### Scenario: Visitor hovers a skill pill

- **WHEN** a visitor hovers the "PyTorch" pill
- **THEN** its border, icon, and label all brighten together

#### Scenario: Skill name is readable without its icon

- **WHEN** a brand mark fails to load
- **THEN** the skill name remains visible so the entry is still legible

### Requirement: Pills wrap rather than overflow

Within a group, pills SHALL flow horizontally and wrap onto additional lines as width decreases, with consistent gaps in both axes. No group SHALL produce horizontal overflow at any supported viewport width.

#### Scenario: Visitor views skills at 320px

- **WHEN** the viewport is 320px wide
- **THEN** pills wrap onto multiple lines and no horizontal scrollbar appears
