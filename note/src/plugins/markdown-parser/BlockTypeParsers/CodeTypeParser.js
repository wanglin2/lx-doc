export function parseCodeToMarkdown(blocks) {
  return `\`\`\`\n${blocks.code}\n\`\`\`\n`;
}

export function parseMarkdownToCode(blocks) {
  const codeData = {
    data: {
      code: blocks.value,
    },
    type: 'code',
  };

  return codeData;
}
