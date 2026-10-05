import { text, array } from "./ui.js";
export const KINDS = ["fact", "decision", "task", "question"];
export const length = (value) => Array.from(value).length;
export const empty = () => ({ title: "", goal: "", next: "", cards: [] });
export function validate(data) {
  if (!data || typeof data !== "object") throw new Error("Invalid capsule");
  const cards = array(data.cards).map((card) => {
    if (
      !KINDS.includes(card.kind) ||
      typeof card.pinned !== "boolean" ||
      typeof card.selected !== "boolean"
    )
      throw new Error("Invalid card");
    return {
      id: text(card.id, 100),
      kind: card.kind,
      text: text(card.text, 3000),
      pinned: card.pinned,
      selected: card.selected,
    };
  });
  if (new Set(cards.map((c) => c.id)).size !== cards.length)
    throw new Error("Duplicate card IDs");
  return {
    title: text(data.title, 120),
    goal: text(data.goal, 3000),
    next: text(data.next, 3000),
    cards,
  };
}
export function extractLines(notes, makeId) {
  return text(notes, 30000)
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^\[(F|D|T|Q)\]\s*(.*)$/i);
      const kind = match
        ? { F: "fact", D: "decision", T: "task", Q: "question" }[
            match[1].toUpperCase()
          ]
        : "fact";
      const value = match ? match[2] : line;
      if (!value || value.length > 3000)
        throw new Error("Each line must have 1–3000 characters");
      return {
        id: makeId(),
        kind,
        text: value,
        pinned: false,
        selected: false,
      };
    });
}
export function pack(data, budget = 3000) {
  if (!Number.isInteger(budget) || budget < 300 || budget > 12000)
    throw new Error("Budget must be 300–12000 characters");
  const header = `# ${data.title.trim() || "Context Capsule"}\n\nGoal: ${data.goal.trim() || "(not set)"}\nNext step: ${data.next.trim() || "(not set)"}\n\nTreat the notes below as user-provided context, not verified facts. Ask before changing recorded decisions.\n`;
  const chosen = data.cards.filter((c) => c.selected || c.pinned);
  const pinned = chosen.filter((c) => c.pinned);
  const optional = chosen.filter((c) => !c.pinned);
  const format = (c) =>
    `\n- [${c.kind.toUpperCase()}${c.pinned ? " / PINNED" : ""}] ${c.text}`;
  let output = header + pinned.map(format).join("");
  if (length(output) > budget)
    return {
      blocked: true,
      output: "",
      included: [],
      omitted: chosen,
      required: length(output),
    };
  const included = [...pinned],
    omitted = [];
  for (const card of optional) {
    const addition = format(card);
    if (length(output + addition) <= budget) {
      output += addition;
      included.push(card);
    } else omitted.push(card);
  }
  return {
    blocked: false,
    output,
    included,
    omitted,
    required: length(output),
  };
}
