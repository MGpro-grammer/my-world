<div align="center">

# My World

**Personal portfolio website of Georges Mouratidis — an animated sea of dots where each bubble reveals a project.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)

> **Work in progress** — the website is under active development.

</div>

## Table of contents

- [About](#about)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Roadmap](#roadmap)

## About

**my-world** is the personal portfolio of Georges Mouratidis, a student in application development
at HE2B ESI (Brussels). Visitors explore the projects as bubbles floating on an animated sea of dots;
each bubble leads to a page with a video demo and a link to the source code.

## Tech stack

| Area         | Technology                     |
| ------------ | ------------------------------ |
| Language     | TypeScript                     |
| UI           | React 19                       |
| Build tool   | Vite 8                         |
| Code quality | ESLint, Prettier, EditorConfig |
| Hosting      | GitHub Pages (planned)         |

## Project structure

```text
my-world/
├── public/          # Static files served as-is
└── src/
    ├── main.tsx     # Entry point
    ├── App.tsx      # Root component
    └── styles/      # Global styles
```

The full architecture (layers and design patterns) will be documented as it is implemented.

## Getting started

### Prerequisites

- Node.js 24 LTS or later
- npm

### Installation

```bash
git clone https://github.com/MGpro-grammer/my-world.git
cd my-world
npm install
```

### Available scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the development server            |
| `npm run build`        | Type-check and build for production     |
| `npm run preview`      | Preview the production build locally    |
| `npm run lint`         | Lint the code with ESLint               |
| `npm run format`       | Format the code with Prettier           |
| `npm run format:check` | Check formatting without changing files |

## Roadmap

- [x] Project setup (Vite, React, TypeScript, ESLint, Prettier)
- [ ] Animated sea of dots
- [ ] Project bubbles and project pages with video demos
- [ ] French and English translations
- [ ] Deployment to GitHub Pages
