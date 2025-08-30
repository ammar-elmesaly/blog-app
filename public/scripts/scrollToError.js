document.addEventListener("DOMContentLoaded", () => {
  const errEl = document.querySelector("#error-message");
  if (errEl) {
    errEl.scrollIntoView({ behavior: "smooth" });
  }
});