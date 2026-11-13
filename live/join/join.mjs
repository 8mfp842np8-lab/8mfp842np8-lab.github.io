export function invitationCode(href) {
  if (typeof href !== "string"
      || href.match(/^https:\/\/([^/?#]*)/i)?.[1].toLowerCase() !== "8mfp842np8-lab.github.io"
      || href.includes("#")) return null;
  let url;
  try { url = new URL(href); } catch { return null; }
  if (url.protocol !== "https:" || url.hostname !== "8mfp842np8-lab.github.io"
      || url.username || url.password || url.port || url.hash
      || !["/live/join/", "/live/join"].includes(url.pathname)) return null;
  const entries = [...url.searchParams];
  if (entries.length !== 1 || entries[0][0] !== "code") return null;
  const code = entries[0][1].toUpperCase();
  return /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/.test(code) ? code : null;
}

export function renderInvitation(document, href, clipboard) {
  const code = invitationCode(href);
  const section = document.getElementById("invitation");
  const invalid = document.getElementById("invalid");
  const open = document.getElementById("open-app");
  const status = document.getElementById("status");
  section.hidden = !code;
  invalid.hidden = Boolean(code);
  open.hidden = !code;
  if (!code) {
    open.removeAttribute("href");
    return;
  }
  document.getElementById("code").textContent = code;
  open.href = `smartcaddie://live/join?code=${encodeURIComponent(code)}`;
  open.addEventListener("click", () => {
    status.textContent = "Die App übernimmt deinen Code. Falls sie nicht öffnet, findest du unten Hilfe.";
  });
  document.getElementById("copy-code").addEventListener("click", async () => {
    try {
      if (!clipboard?.writeText) throw new Error("Clipboard unavailable");
      await clipboard.writeText(code);
      status.textContent = "Code kopiert. In SmartCaddie kannst du ihn unter Live-Scoring einfügen.";
    } catch {
      status.textContent = "Kopieren ist hier nicht möglich. Halte den angezeigten Code gedrückt und wähle Kopieren.";
    }
  });
}

if (typeof document !== "undefined") {
  renderInvitation(document, window.location.href, navigator.clipboard);
}
