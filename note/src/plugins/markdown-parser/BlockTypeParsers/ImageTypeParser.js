export function parseImageToMarkdown(blocks) {
  return `![${blocks.caption}](${blocks.url} "${blocks.caption}")`.concat('\n');
}
