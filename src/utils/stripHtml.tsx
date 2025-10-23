export function stripHtml(html: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

export function formatHtmlDynamically(htmlString: string): string {
  if (!htmlString) return "";

  // Create a temporary DOM element to parse the HTML
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;

  let result = "";

  // Recursive function to process nodes
  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      // Text node: append the text content
      return (node as Text).textContent?.trim() || "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      let textContent = "";

      if (["p", "div", "section"].includes(tagName)) {
        // Block-level tags: Add content with double newline
        textContent +=
          Array.from(element.childNodes).map(processNode).join(" ") + "\n\n";
      } else if (tagName === "ul") {
        // List tag: Process each <li> and indent
        textContent +=
          Array.from(element.childNodes)
            .filter(
              (child): child is HTMLElement =>
                child.nodeType === Node.ELEMENT_NODE &&
                (child as HTMLElement).tagName === "LI"
            )
            .map((li) => `- ${processNode(li)}`) // Add `-` for each list item
            .join("\n") + "\n\n";
      } else if (tagName === "li") {
        // List item tag: Process only once to avoid adding multiple bullets
        textContent += `${Array.from(element.childNodes)
          .map(processNode)
          .join(" ")}`;
      } else {
        // Inline or other tags: Append their content
        textContent += Array.from(element.childNodes)
          .map(processNode)
          .join(" ");
      }

      return textContent.trim();
    }

    return "";
  }

  // Process each child of the root element
  result = Array.from(tempElement.childNodes)
    .map(processNode)
    .join("\n")
    .trim();

  return result;
}
