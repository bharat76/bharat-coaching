document.getElementById("year").textContent = new Date().getFullYear();

function handleCalendarSignIn(response) {
  try {
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    if (!payload || !payload.email) return;
  } catch (e) {
    return;
  }
  localStorage.setItem("calendarAuthed", "true");
  const gate = document.getElementById("calendar-signin");
  if (gate) gate.hidden = true;
  const link = document.getElementById("calendar-link");
  if (link) {
    link.href = link.dataset.calHref;
    link.target = "_blank";
    window.open(link.dataset.calHref, "_blank", "noopener");
  }
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
    gate.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
