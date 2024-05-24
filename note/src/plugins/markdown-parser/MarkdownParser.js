import { parseHeaderToMarkdown } from './BlockTypeParsers/HeaderTypeParser';
import { parseParagraphToMarkdown } from './BlockTypeParsers/ParagraphTypeParser';
import { parseListToMarkdown } from './BlockTypeParsers/ListTypeParser';
import { parseDelimiterToMarkdown } from './BlockTypeParsers/DelimiterTypeParser';
import { parseImageToMarkdown } from './BlockTypeParsers/ImageTypeParser';
import { parseCheckboxToMarkdown } from './BlockTypeParsers/CheckboxTypeParser';
import { parseQuoteToMarkdown } from './BlockTypeParsers/QuoteTypeParser';
import { parseCodeToMarkdown } from './BlockTypeParsers/CodeTypeParser';
import { fileDownloadHandler } from './FileHandler';

/**
 * Markdown Parsing class
 */
export default class MarkdownParser {
  /**
   * creates the Parser plugin
   * {editorData, api functions} - necessary to interact with the editor
   */
  constructor({ data, api }) {
    this.data = data;
    this.api = api;
  }

  /**
   * @return Plugin data such as title and icon
   */
  static get toolbox() {
    return {
      title: 'Download Markdown',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(112, 118, 132)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    };
  }

  /**
   * @return empty div and run the export funtion
   */
  render() {
    const doc = document.createElement('div');

    this.getContent();
    return doc;
  }

  /**
   * Function which takes saved editor data and runs the different parsing helper functions
   * @return Markdown file download
   */
  async getContent() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    const initialData = {};
    const data = await this.api.saver.save();

    initialData.content = data.blocks;

    const parsedData = initialData.content.map((item) => {
      // iterate through editor data and parse the single blocks to markdown syntax
      switch (item.type) {
        case 'header':
          return parseHeaderToMarkdown(item.data);
        case 'paragraph':
          return parseParagraphToMarkdown(item.data);
        case 'list':
          return parseListToMarkdown(item.data);
        case 'delimiter':
          return parseDelimiterToMarkdown(item);
        case 'image':
          return parseImageToMarkdown(item.data);
        case 'quote':
          return parseQuoteToMarkdown(item.data);
        case 'checkbox':
          return parseCheckboxToMarkdown(item.data);
        case 'code':
          return parseCodeToMarkdown(item.data);
        case 'checklist':
          return parseCheckboxToMarkdown(item.data);
        default:
          break;
      }
    });

    // take parsed data and create a markdown file
    fileDownloadHandler(parsedData.join('\n'), `entry_${dd}-${mm}-${yyyy}.md`);
  }

  save() {
    return {
      message: 'Downloading Markdown',
    };
  }
}
