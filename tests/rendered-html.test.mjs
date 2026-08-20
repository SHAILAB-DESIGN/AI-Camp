import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, projectRoot), "utf8");
}

test("defines the public activity routes and metadata", async () => {
  const [layout, home, register, invitations] = await Promise.all([
    read("app/layout.tsx"),
    read("app/page.tsx"),
    read("app/register/page.tsx"),
    read("app/invitations/page.tsx"),
  ]);

  assert.match(layout, /AI科研加速营｜书生·端砚/);
  assert.match(home, /AI科研加速营/);
  assert.match(register, /AI 科研加速营报名/);
  assert.match(invitations, /邀请福利/);
});

test("keeps required registration validation in source", async () => {
  const form = await read("app/register/registration-form.tsx");

  for (const field of ["name", "phone", "province", "city", "organization", "identity", "field", "topic", "ability"]) {
    assert.match(form, new RegExp(`nextErrors\\.${field}`));
  }
  assert.match(form, /nextErrors\.consent/);
});

test("keeps the leaderboard paginated", async () => {
  const leaderboard = await read("app/invitations/leaderboard.tsx");

  assert.match(leaderboard, /const PAGE_SIZE = 20/);
  assert.match(leaderboard, /排行榜分页/);
  assert.match(leaderboard, /按成功报名人数排序/);
});
