import { list } from "postcss";

export default defineContentScript({
  matches: ["https://*/*"],
  cssInjectionMode : "manifest",
  main() {
    console.log("Hello content.");
    initializeSelectionListener();
  },
});

function initializeSelectionListener(): void {
  let timeout: number | undefined;

  document.addEventListener("selectionchange", () => {
    // Clear existing timeout if there is one
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }

    // Set new timeout
    timeout = window.setTimeout(handleSelectionChange, 700); // Wait for 700 milliseconds after selection changes
  });

  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keydown", handleKeyDown);
}

function handleSelectionChange(): void {
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const selectedText = selection.toString();
    const url = window.location.href;
    const currentTime = new Date().toLocaleString();

    console.log("Selected Text:", selectedText);
    console.log("URL:", url);
    console.log("Time:", currentTime);

    // Remove any existing button
    const existingButton = document.getElementById("selection-button");
    if (existingButton) {
      existingButton.remove();
    }

    // Check if selectedText is not empty
    if (selectedText.trim() !== "") {
      createSelectionButton(selectedText);
    }
  }
}

// to toggle the button
function handleMouseUp(): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    const existingButton = document.getElementById("selection-button");
    if (existingButton) {
      existingButton.remove();
    }
  }
}

// to handle toggling modal with keyboard shortcut
function handleKeyDown(event: KeyboardEvent): void {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const isShortcut = (event.metaKey || event.ctrlKey) && event.key === "k";

  if (isShortcut) {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : "";

    if (selectedText !== "") {
      event.preventDefault();
      const overlay = document.getElementById("overlay");
      if (overlay) {
        overlay.remove();
      } else {
        console.log("Modal creating...");
        createModal(selectedText);
      }
    }
  }

  // Close modal with ESC key
  if (event.key === "Escape") {
    const overlay = document.getElementById("overlay");
    if (overlay) {
      overlay.remove();
    }
  }
}

export function createSelectionButton(selectedText: string): void {
  // Create a button element
  const button = document.createElement("button");
  button.id = "selection-button";
  button.textContent = "Click Me";

  // Get the bounding rectangle of the start of the selected text
  const range = window.getSelection()?.getRangeAt(0);
  const rect = range?.getClientRects()[0];

  if (rect) {
    // Position the button near the start of the selected text
    button.style.position = "absolute";
    button.style.left = `${rect.left + window.scrollX}px`;
    button.style.top = `${rect.top + window.scrollY}px`;

    // Append the button to the document body
    document.body.appendChild(button);

    // Add click event listener to the button
    button.addEventListener("click", () => createModal(selectedText));
  }
}

export function createModal(selectedText: string): void {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";

  // Create modal
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.style.width = "32rem";
  modal.style.height = "40rem";
  modal.style.backgroundColor = "white";
  modal.style.padding = "20px";
  modal.style.borderRadius = "5px";
  modal.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";

  // Create search bar
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "Search...";
  searchBar.style.marginBottom = "20px";
  searchBar.style.padding = "10px";
  searchBar.style.border = "1px solid #ccc";
  searchBar.style.borderRadius = "5px";

  // Create list container
  const listContainer = document.createElement("div");
  listContainer.id = "list-container";
  listContainer.style.flex = "1";
  listContainer.style.overflowY = "auto";

  // Add buttons for each prompt type
  addPromptButtons(listContainer, selectedText);

  // Append search bar and list container to modal
  modal.appendChild(searchBar);
  modal.appendChild(listContainer);

  // Append modal to overlay
  overlay.appendChild(modal);

  // Append overlay to document body
  document.body.appendChild(overlay);

  // Add click event listener to overlay to remove it
  overlay.addEventListener("click", () => {
    overlay.remove();
  });

  // Prevent clicks inside the modal from closing it
  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

function addPromptButtons(
  listContainer: HTMLElement,
  selectedText: string
): void {
  const promptTypes = [
    "EXPLAIN_LIKE_FIVE",
    "EXPLAIN_TOPIC",
    "LIST_TAKEAWAYS",
    "LONG_SUMMARY",
    "REPHRASE_FOR_REFERENCE",
    "SINGLE_PARAGRAPH",
    "SHORT_SUMMARY",
    "CUSTOM_PROMPT",
  ];

  promptTypes.forEach((promptType) => {
    const listItemButton = document.createElement("button");
    listItemButton.textContent = promptType;
    listItemButton.style.padding = "10px";
    listItemButton.style.border = "1px solid #ccc";
    listItemButton.style.marginBottom = "5px";
    listItemButton.style.width = "100%";
    listItemButton.setAttribute("data-promptType", promptType);
    listItemButton.addEventListener("click", () => {
      const promptType = listItemButton.getAttribute("data-promptType");
      if (promptType) {
        showLoadingState(listContainer);
        makeFetchRequest({ promptType, prompt: selectedText });
      }
    });
    listContainer.appendChild(listItemButton);
  });
}

function showLoadingState(listContainer: HTMLElement): void {
  listContainer.innerHTML = ""; // Clear existing list items
  const loadingIndicator = document.createElement("div");
  loadingIndicator.textContent = "Loading...";
  loadingIndicator.style.textAlign = "center";
  loadingIndicator.style.marginTop = "20px";
  listContainer.appendChild(loadingIndicator);
}

export async function makeFetchRequest(variables: {
  promptType: string;
  prompt: string;
}) {
  try {
    const res = await fetch("http://localhost:8686/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query AskAI($promptType: String!, $prompt: String!) {
            askAI(promptType: $promptType, prompt: $prompt)
          }
        `,
        variables,
      }),
    });

    const response = await res.json();
    console.log(response.data.askAI);

    // Show the response in the modal
    const listContainer = document.getElementById("list-container");
    if (listContainer) {
      listContainer.innerHTML = ""; // Clear existing list items

      // Create a back button
      const backButton = document.createElement("button");
      backButton.textContent = "Back";
      backButton.classList.add("mb-5"); // Tailwind CSS class for margin-bottom: 20px
      backButton.addEventListener("click", () => {
        // Restore the original list items
        listContainer.innerHTML = "";
        addPromptButtons(listContainer, variables.prompt);
      });

      // Append the back button to the list container
      listContainer.appendChild(backButton);

      // Display the response data
      const responseData = document.createElement("div");
      responseData.textContent = JSON.stringify(response.data.askAI, null, 2);
      responseData.classList.add(
        "whitespace-pre-wrap",
        "bg-pink-600",
        "p-4",
        "rounded"
      ); // Tailwind CSS classes for styling the response data
      listContainer.appendChild(responseData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
