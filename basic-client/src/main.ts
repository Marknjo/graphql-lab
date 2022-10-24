import "./style.css";

// const rootEl = document.getElementById("app");
const displayEl = document.querySelector(".greeting") as HTMLElement;
const greetingsBtnEl = document.querySelector(
  ".btn-fetch"
) as HTMLButtonElement;

async function fetchGreetings() {
  try {
    const response = await fetch("http://localhost:9000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query {
          greeting
        }
      `,
      }),
    });

    if (!response.ok) {
      const errorMsg = `${response.status}, ${response.statusText}, "Repose failed"`;
      throw new Error(errorMsg);
    }

    const {
      data: { greeting },
    } = await response.json();

    displayEl.textContent = greeting;
  } catch (error: any) {
    console.log(error.message);
  }
}

greetingsBtnEl.addEventListener("click", () => {
  if (displayEl) {
    displayEl.textContent = "Loading...";
  }

  fetchGreetings();
});
