export function parseHeaderToMarkdown(blocks) {
  switch (blocks.level) {
    case 1:
      return `# ${blocks.text}\n`;
    case 2:
      return `## ${blocks.text}\n`;
    case 3:
      return `### ${blocks.text}\n`;
    case 4:
      return `#### ${blocks.text}\n`;
    case 5:
      return `##### ${blocks.text}\n`;
    case 6:
      return `###### ${blocks.text}\n`;
    default:
      break;
  }
}

export function parseMarkdownToHeader(blocks) {
  let headerData = {};

  switch (blocks.depth) {
    case 1:
      blocks.children.forEach((item) => {
        headerData = {
          data: {
            level: 1,
            text: item.value,
          },
          type: 'header',
        };
      });

      return headerData;
    case 2:
      blocks.children.forEach((item) => {
        headerData = {
          data: {
            level: 2,
            text: item.value,
          },
          type: 'header',
        };
      });

      return headerData;
    case 3:
      blocks.children.forEach((item) => {
        headerData = {
          data: {
            level: 3,
            text: item.value,
          },
          type: 'header',
        };
      });

      return headerData;
    case 4:
      blocks.children.forEach((item) => {
        headerData = {
          data: {
            level: 4,
            text: item.value,
          },
          type: 'header',
        };
      });

      return headerData;
    case 5:
      blocks.children.forEach((item) => {
        headerData = {
          data: {
            level: 5,
            text: item.value,
          },
          type: 'header',
        };
      });

      return headerData;
    case 6:
      blocks.children.forEach((item) => {
        headerData = {
          data: {
            level: 6,
            text: item.value,
          },
          type: 'header',
        };
      });

      return headerData;
    default:
      break;
  }
}
