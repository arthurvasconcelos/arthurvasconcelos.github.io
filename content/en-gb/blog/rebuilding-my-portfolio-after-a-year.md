---
title: "Rebuilding My Portfolio After a Year of Neglect"
description: "The specific and slightly embarrassing story of what happens when you let a year pass between commits on your own portfolio."
date: 2026-05-01
translationKey: "rebuilding-my-portfolio-after-a-year"
---

I have this repository open right now, and the previous commit before this year's work is from April 2025. The commit message is "add modernization plan and handoff convention." I wrote a plan. I committed it. And then I went 365 days without touching it.

This is not a productivity post. I'm not going to tell you about my system for keeping side projects alive. I don't have one. What I have is a portfolio that kept saying "Currently at Kognity" months after I'd moved on, a `console.log("app.vue:", colorMode)` shipping to production, and a primary accent color that was literally `#ff0000`.

Not a design choice. Pure red. There's even a comment next to it: `// TODO: figure out brand color`. At some point in 2025 I thought I'd remember to fix it. I did not.

## What it looked like coming back

The main thing I noticed when finally sitting down with this in April: a codebase that was mostly fine but full of small embarrassments. The red. The `console.log`. A `README2.md` (contents: Nuxt boilerplate docs, copied from the starter template and apparently never opened again). A `deploy.bat` file on a Mac that deploys to Linux. A footer component imported nowhere, doing nothing. Ten open Dependabot PRs I'd marked as approved and then never merged.

The instinct when you see this kind of thing in your own code is to feel bad about it. I've mostly learned to treat it as sedimented evidence of past priorities. The code was functional enough to keep the site up; fixing it was never urgent enough to actually do.

What I did feel: if this were someone else's repo and I was doing a code review, I'd have a lot of comments.

## The practical work

I migrated from Yarn 1 to pnpm (Yarn 1 hasn't been maintained for years; I'd been meaning to do this in personal projects), resolved all the Dependabot PRs in one pass, and deleted the dead files. Added ESLint and Prettier since there was somehow no linter at all. Not exciting. Necessary.

The more interesting part: pulling hardcoded content out of Vue components. My work history was in a `.vue` file. Adding a new job meant editing component markup. Updating it felt like more friction than it was worth, which is exactly why it still said Kognity when I came back to it.

Moved everything to typed data files — `work-experiences.ts`, `skills.ts`, `projects.ts`. Components are presentational now. Updating the content is just updating an array; there's no reason to touch a component.

I also killed the skill percentage bars. "TypeScript: 90%." I hate those. The numbers are made-up and invite two failure modes: either you lowball and look like you're hedging, or you highball and invite someone to quiz you at exactly your claimed threshold. Replaced them with categorical chips — Languages, Front-end, Back-end, etc. More honest, less gameable.

## The i18n I underestimated

The site is now in English, Portuguese, and Swedish. I live in Sweden, grew up in Brazil, work in English. It made sense to cover all three.

Setting up `@nuxtjs/i18n` was not the hard part. The hard part was writing the actual translations. Specifically, writing my professional experience in Swedish in a way that doesn't obviously sound like it was run through a translator.

My Swedish is functional — I can have most conversations, including work conversations when they come up. But formal register is different from conversational register. I spent more time on the Swedish professional bio than on everything else combined. It's still not perfect.

The Portuguese was easier (obviously) but had its own edge cases. "Tech Lead" in Brazilian software is usually just "Tech Lead" as a loan word, but "Senior Front-End Engineer" becomes "Engenheiro Front-End Sênior" and there are real opinions in the community about whether that calque is correct. I have opinions. I made choices. Some Brazilian developer is going to read this and have a take.

## What didn't make the cut

I considered a projects section that auto-pulled from GitHub activity. Decided against it — auto-pulled data is lazy and the resulting lists are noise. The projects page now has a curated set: [Overseer](https://github.com/arthurvasconcelos/overseer), the Go CLI I built for managing multiple services locally and use daily, its Python and TypeScript SDKs, the sqlalchemy-seedling library I built for a seeding workflow I kept repeating across projects, and a legacy section for the two Vue component libraries I published in 2018 that still have some users.

I also considered a more significant visual redesign. Left it mostly as-is. The dark gradient background works fine. Not everything needs to be rethought.

## Why I'm writing this

I want a blog. Not a tutorial blog — there are better tutorials than I would write for almost any topic. More like this: specific writeups about what I'm actually building, what went wrong, what decisions I'd revisit.

The site rebuild was the natural starting point. It's meta in a way I can live with, because it's also genuinely what I've been working on, and writing down the decisions forces me to actually have opinions about them rather than just doing things.

More posts coming. I have notes on building Overseer, some thoughts on the TypeScript patterns I use at Platform24 that differ from what I see in most Vue and React codebases, and probably some things about Stockholm that have nothing to do with code.

The blog is live. That's a good enough place to start.
