import "./style.css";

const rootEl = document.getElementById("app");
const displayEl = document.querySelector(".greeting") as HTMLElement;

if (displayEl) {
  displayEl.textContent = "Loading...";
}
