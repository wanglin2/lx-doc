export function parseCheckboxToMarkdown(blocks) {
  let items = {};

  items = blocks.items.map((item) => {
    if (item.checked === true) {
      return `- [x] ${item.text}`;
    }
    return `- [ ] ${item.text}`;
  });

  return items.join('\n');
}
