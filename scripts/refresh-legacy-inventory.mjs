#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = "/Users/qujianglong/Desktop/Agent/sources";
const inventoryPath = path.join(root, "data/legacy/inventory.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));

for (const repo of inventory.repositories) {
  const dir = path.join(sourceRoot, repo.slug === "MonkeyCode" ? "MonkeyCode" : repo.slug);
  const head = execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const date = execFileSync("git", ["-C", dir, "show", "-s", "--format=%cI", head], { encoding: "utf8" }).trim();
  const subject = execFileSync("git", ["-C", dir, "show", "-s", "--format=%s", head], { encoding: "utf8" }).trim();
  repo.head = head;
  repo.shortHead = head.slice(0, 8);
  repo.commitDate = date;
  repo.subject = subject;
  repo.shallow = true;
}

inventory.generatedAt = new Date().toISOString();
inventory.baselinePolicy = "每个仓库固定到本次刷新后的远端分支 HEAD；源码摘录、版本链接和报告证据必须指向同一提交。旧 finding 的语义仍需在页面中按证据等级复核。";
fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
console.log(JSON.stringify({ repositories: inventory.repositories.length, generatedAt: inventory.generatedAt }));
