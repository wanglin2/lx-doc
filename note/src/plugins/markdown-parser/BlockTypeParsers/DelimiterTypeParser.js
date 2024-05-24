export function parseDelimiterToMarkdown() {
  const delimiter = '---';

  return delimiter.concat('\n');
}

export function parseMarkdownToDelimiter() {
  let delimiterData = {};

  delimiterData = {
    data: {
      items: [],
    },
    type: 'delimiter',
  };

  return delimiterData;
}
