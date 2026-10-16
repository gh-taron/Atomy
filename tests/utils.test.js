import test from "node:test";
import assert from "node:assert/strict";
import {
  matchesSearch,
  normalizePhone,
  escapeHtml,
  sendRegistration,
} from "../js/utils.js";

test("la recherche accepte les caractères spéciaux sans exception", () => {
  for (const query of ["[", "(", String.fromCharCode(92), "*", "?"])
    assert.equal(matchesSearch(query, "Atomy cream"), false);
  assert.equal(matchesSearch("крем атоми", "Атоми крем для лица"), true);
  assert.equal(matchesSearch("  cream  atomy ", "Atomy Cream"), true);
});

test("les numéros internationaux conservent un seul préfixe", () => {
  assert.equal(normalizePhone("+32 470 12 34 56"), "+32470123456");
  assert.equal(normalizePhone("79595269800"), "+79595269800");
  assert.throws(() => normalizePhone("123"));
  assert.throws(() => normalizePhone("000000000"));
});

test("les réponses du chat échappent le HTML", () => {
  assert.equal(
    escapeHtml('<img onerror="alert(1)">'),
    "&lt;img onerror=&quot;alert(1)&quot;&gt;",
  );
});

test("une demande n’est réussie qu’après confirmation effective de l’API", async () => {
  const original = globalThis.fetch;
  try {
    await assert.rejects(sendRegistration("", {}));
    globalThis.fetch = async () => new Response("{}", { status: 500 });
    await assert.rejects(sendRegistration("/api", {}));
    globalThis.fetch = async () =>
      new Response('{"success":false}', { status: 200 });
    await assert.rejects(sendRegistration("/api", {}));
    globalThis.fetch = async () =>
      new Response('{"success":true}', { status: 200 });
    assert.deepEqual(await sendRegistration("/api", {}), { success: true });
  } finally {
    globalThis.fetch = original;
  }
});
