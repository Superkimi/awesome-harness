#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { projects } from "../data/projects.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "sources");
fs.mkdirSync(sourceRoot, { recursive: true });

for (const project of projects) {
  const target = path.join(sourceRoot, project.slug);
  if (!fs.existsSync(path.join(target, ".git"))) {
    const clone = spawnSync("git", ["clone", `https://github.com/${project.repo}.git`, target], { stdio: "inherit" });
    if (clone.status !== 0) process.exit(clone.status ?? 1);
  }
  const fetch = spawnSync("git", ["-C", target, "fetch", "--all", "--tags", "--prune"], { stdio: "inherit" });
  if (fetch.status !== 0) process.exit(fetch.status ?? 1);
  const checkout = spawnSync("git", ["-C", target, "checkout", "--detach", project.commit], { stdio: "inherit" });
  if (checkout.status !== 0) process.exit(checkout.status ?? 1);
  console.log(`${project.slug} ${project.commit}`);
}
