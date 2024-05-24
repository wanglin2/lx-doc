export function parseParagraphToMarkdown(blocks) {
  return `${blocks.text}\n`;
}

export function parseMarkdownToParagraph(blocks) {
  let paragraphData = {};

  if (blocks.type === 'paragraph') {
    blocks.children.forEach((item) => {
      if (item.type === 'text') {
        paragraphData = {
          data: {
            text: item.value,
          },
          type: 'paragraph',
        };
      }
      if (item.type === 'image') {
        paragraphData = {
          data: {
            caption: item.title,
            stretched: false,
            url: item.url,
            withBackground: false,
            withBorder: false,
          },
          type: 'image',
        };
      }
    });
  }
  return paragraphData;
}
