document.getElementById("year").textContent = new Date().getFullYear();

const GOOGLE_CLIENT_ID = "126352222632-0evic5r6luh3ibg8qka6a2e2tqd17744.apps.googleusercontent.com";
let googleInitialized = false;
let googleButtonRendered = false;

function handleCalendarSignIn(response) {
  try {
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    if (!payload || !payload.email) return;
  } catch (e) {
    return;
  }
  localStorage.setItem("calendarAuthed", "true");
  const link = document.getElementById("calendar-link");
  const gate = document.getElementById("calendar-signin");
  if (link) {
    link.href = link.dataset.calHref;
    link.target = "_blank";
  }
  if (gate && link) {
    gate.innerHTML =
      '<p>You\'re verified &mdash; tap below to open your calendar.</p>' +
      '<a class="cta" href="' + link.dataset.calHref + '" target="_blank" rel="noopener">Open Calendar &rarr;</a>';
  }
}

function renderGoogleButton(attempt) {
  attempt = attempt || 0;
  if (googleButtonRendered) return;
  const container = document.getElementById("google-signin-button");
  if (!container) return;

  if (typeof google === "undefined" || !google.accounts || !google.accounts.id) {
    if (attempt < 25) setTimeout(() => renderGoogleButton(attempt + 1), 200);
    return;
  }

  if (!googleInitialized) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCalendarSignIn,
    });
    googleInitialized = true;
  }

  google.accounts.id.renderButton(container, { type: "standard", size: "medium" });
  googleButtonRendered = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("calendar-link");
  const gate = document.getElementById("calendar-signin");
  if (!link || !gate) return;

  if (localStorage.getItem("calendarAuthed") === "true") {
    link.href = link.dataset.calHref;
    link.target = "_blank";
    return;
  }

  link.addEventListener("click", (e) => {
    e.preventDefault();
    gate.hidden = false;
    renderGoogleButton();
    gate.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
