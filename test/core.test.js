import test from "node:test";
import assert from "node:assert/strict";
import { empty, validate, extractLines, pack, length } from "../src/core.js";
const card = (id, value, pinned = false, selected = true) => ({
  id,
  kind: "fact",
  text: value,
  pinned,
  selected,
});
test("empty state validates", () =>
  assert.deepEqual(validate(empty()), empty()));
test("invalid category rejected", () =>
  assert.throws(() =>
    validate({ ...empty(), cards: [{ ...card("1", "hi"), kind: "invented" }] }),
  ));
test("duplicate IDs rejected", () =>
  assert.throws(() =>
    validate({ ...empty(), cards: [card("1", "x"), card("1", "y")] }),
  ));
test("oversized fields rejected", () =>
  assert.throws(() => validate({ ...empty(), title: "x".repeat(121) })));
test("tagged lines keep user wording and start unselected", () => {
  let id = 0;
  const r = extractLines("[D] Keep offline\n- a fact\n[Q] Why?", () =>
    String(++id),
  );
  assert.deepEqual(
    r.map((x) => x.kind),
    ["decision", "fact", "question"],
  );
  assert.ok(r.every((x) => !x.selected));
  assert.equal(r[1].text, "a fact");
});
test("blank lines are ignored", () =>
  assert.equal(extractLines(" \n\n", () => "1").length, 0));
test("empty tag rejected", () =>
  assert.throws(() => extractLines("[T] ", () => "1")));
test("pinned items carried even if selection false", () =>
  assert.equal(
    pack({ ...empty(), cards: [card("1", "required", true, false)] }).included
      .length,
    1,
  ));
test("unselected optional items excluded", () =>
  assert.equal(
    pack({ ...empty(), cards: [card("1", "optional", false, false)] }).included
      .length,
    0,
  ));
test("whole optional items omitted when budget full", () => {
  const r = pack({ ...empty(), cards: [card("1", "x".repeat(400))] }, 300);
  assert.equal(r.omitted.length, 1);
  assert.ok(!r.output.includes("xxx"));
  assert.ok(length(r.output) <= 300);
});
test("pinned overflow blocks all export", () => {
  const r = pack(
    { ...empty(), cards: [card("1", "x".repeat(400), true)] },
    300,
  );
  assert.ok(r.blocked);
  assert.equal(r.output, "");
});
test("later short optional card can fit", () => {
  const r = pack(
    { ...empty(), cards: [card("1", "x".repeat(500)), card("2", "short")] },
    300,
  );
  assert.equal(r.included[0].id, "2");
});
test("goal and next step are never truncated", () =>
  assert.ok(pack({ ...empty(), goal: "x".repeat(400) }, 300).blocked));
test("budget rejects fractions, NaN and bounds", () => {
  for (const n of [299, 12001, 300.5, NaN])
    assert.throws(() => pack(empty(), n));
});
test("Unicode counts code points", () => assert.equal(length("a🌱"), 2));
test("text is preserved even when containing markup", () =>
  assert.ok(
    pack({
      ...empty(),
      cards: [card("1", "<script>test</script>")],
    }).output.includes("<script>test</script>"),
  ));
