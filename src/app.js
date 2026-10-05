import {
  $,
  esc,
  t,
  uid,
  init,
  notify,
  save,
  load,
  copy,
  download,
  backup,
  bindImport,
} from "./ui.js";
import { empty, validate, pack, extractLines, length } from "./core.js";
const KEY = "context-capsule:v1";
let state = load(KEY, empty(), validate),
  editing = null,
  result;
for (const key of ["title", "goal", "next"]) {
  $(key).value = state[key];
  $(key).oninput = () => {
    state[key] = $(key).value;
    save(KEY, state);
    render();
  };
}
$("budget").oninput = render;
function render() {
  $("cards").innerHTML =
    state.cards
      .map(
        (card) =>
          `<article class="record"><div class="bar"><span class="tag">${esc(card.kind)} ${card.pinned ? "◆" : ""}</span><label class="check"><input type="checkbox" data-select="${esc(card.id)}" ${card.selected || card.pinned ? "checked" : ""} ${card.pinned ? "disabled" : ""}>${t("Pakete al", "Include")}</label></div><p>${esc(card.text)}</p><div class="actions"><button data-edit="${esc(card.id)}">${t("Düzenle", "Edit")}</button><button class="quiet danger" data-delete="${esc(card.id)}">${t("Sil", "Delete")}</button></div></article>`,
      )
      .join("") ||
    `<div class="empty">${t("Henüz kart yok. Bir karar, bilgi veya açık soru ekle.", "No cards yet. Add a decision, fact or open question.")}</div>`;
  try {
    result = pack(state, Number($("budget").value));
    $("output").textContent = result.blocked
      ? t(
          `Sabit içerik ${result.required} karakter. Bütçeyi artır veya sabit kartları düzenle.`,
          `Pinned content needs ${result.required} characters. Increase the budget or edit pinned cards.`,
        )
      : result.output;
    $("count").textContent = result.included.length;
    $("chars").textContent = result.blocked
      ? result.required
      : length(result.output);
    $("omitted").textContent = result.omitted.length
      ? t(
          `Dışarıda kalan ${result.omitted.length} kart: `,
          `${result.omitted.length} omitted cards: `,
        ) + result.omitted.map((c) => c.text.slice(0, 70)).join(" · ")
      : t("Seçilen tüm kartlar pakette.", "All selected cards fit.");
    $("copy").disabled = $("markdown").disabled = result.blocked;
  } catch (error) {
    result = null;
    $("output").textContent = t(
      "300–12000 arasında tam sayı bir bütçe gir.",
      "Enter an integer budget between 300 and 12000.",
    );
    $("copy").disabled = $("markdown").disabled = true;
  }
}
$("cards").onchange = (event) => {
  const id = event.target.dataset.select;
  if (!id) return;
  state.cards.find((c) => c.id === id).selected = event.target.checked;
  save(KEY, state);
  render();
};
$("cards").onclick = (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  if (btn.dataset.delete) {
    state.cards = state.cards.filter((c) => c.id !== btn.dataset.delete);
    if (editing === btn.dataset.delete) resetEditor();
    save(KEY, state);
    render();
  }
  if (btn.dataset.edit) {
    const c = state.cards.find((c) => c.id === btn.dataset.edit);
    editing = c.id;
    $("card-text").value = c.text;
    $("kind").value = c.kind;
    $("pinned").checked = c.pinned;
    $("cancel-edit").hidden = false;
    $("add-card").textContent = t("Kartı güncelle", "Update card");
    $("card-text").focus();
  }
};
function resetEditor() {
  editing = null;
  $("card-form").reset();
  $("cancel-edit").hidden = true;
  $("add-card").textContent = t("Kart ekle", "Add card");
}
$("cancel-edit").onclick = resetEditor;
$("card-form").onsubmit = (event) => {
  event.preventDefault();
  const value = $("card-text").value.trim();
  if (!value) return;
  if (!editing && state.cards.length >= 200)
    return notify(t("En fazla 200 kart.", "Maximum 200 cards."));
  const card = {
    id: editing || uid(),
    kind: $("kind").value,
    text: value,
    pinned: $("pinned").checked,
    selected: true,
  };
  if (editing)
    state.cards = state.cards.map((c) => (c.id === editing ? card : c));
  else state.cards.push(card);
  resetEditor();
  save(KEY, state);
  render();
};
$("extract").onclick = () => {
  try {
    const cards = extractLines($("notes").value, uid);
    if (state.cards.length + cards.length > 200)
      throw new Error(t("En fazla 200 kart.", "Maximum 200 cards."));
    state.cards.push(...cards);
    save(KEY, state);
    render();
    notify(t("Taslakları incele ve seç.", "Review and select the drafts."));
  } catch (error) {
    notify(error.message);
  }
};
$("copy").onclick = () => result && !result.blocked && copy(result.output);
$("markdown").onclick = () =>
  result &&
  !result.blocked &&
  download("context-capsule.md", result.output, "text/markdown");
$("backup").onclick = () => backup("context-capsule", state);
function apply(next) {
  state = next;
  resetEditor();
  for (const k of ["title", "goal", "next"]) $(k).value = state[k];
  save(KEY, state);
  render();
}
bindImport("context-capsule", validate, apply);
$("clear").onclick = () => {
  if (
    confirm(
      t(
        "Bu tarayıcıdaki tüm kapsül notları silinsin mi?",
        "Clear all capsule notes in this browser?",
      ),
    )
  )
    apply(empty());
};
$("demo").onclick = () => {
  if (
    state.cards.length &&
    !confirm(
      t(
        "Mevcut kapsül örnekle değiştirilsin mi? Önce yedek indirebilirsin.",
        "Replace the current capsule with the sample? You can back it up first.",
      ),
    )
  )
    return;
  apply({
    title: "Neighborhood seed library",
    goal: "Build a simple lending page for neighbors.",
    next: "Design the seed availability form.",
    cards: [
      {
        id: uid(),
        kind: "decision",
        text: "No login or paid API in the first version.",
        pinned: true,
        selected: true,
      },
      {
        id: uid(),
        kind: "fact",
        text: "The library has 18 seed varieties; this is fictional demo data.",
        pinned: false,
        selected: true,
      },
      {
        id: uid(),
        kind: "task",
        text: "Add a printable list for the community center.",
        pinned: false,
        selected: true,
      },
      {
        id: uid(),
        kind: "question",
        text: "Should seeds be marked available by packets or by weight?",
        pinned: false,
        selected: true,
      },
    ],
  });
};
init(render);
