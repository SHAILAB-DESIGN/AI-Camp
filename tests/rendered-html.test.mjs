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
  assert.match(register, /AI科研加速营报名/);
  assert.match(invitations, /邀请好友赢好礼/);
});

test("keeps required registration validation in source", async () => {
  const form = await read("app/register/registration-form.tsx");

  for (const field of ["name", "phone", "province", "city", "organization", "identity", "field", "topic", "ability"]) {
    assert.match(form, new RegExp(`nextErrors\\.${field}`));
  }
  assert.match(form, /nextErrors\.consent/);
  assert.match(form, /当前身份/);
  assert.match(form, /优先填写端砚账号绑定手机号/);
});

test("keeps 80 demo entries for the 50-row scroll viewport", async () => {
  const leaderboard = await read("app/invitations/leaderboard.tsx");

  assert.match(leaderboard, /\["80", "陆予安", "0"\]/);
  assert.doesNotMatch(leaderboard, /PAGE_SIZE/);
  assert.match(leaderboard, /按成功报名人数排序/);
});
