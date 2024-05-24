import * as remark from 'remark';
import { parseMarkdownToHeader } from './BlockTypeParsers/HeaderTypeParser';
import { parseMarkdownToParagraph } from './BlockTypeParsers/ParagraphTypeParser';
import { parseMarkdownToList } from './BlockTypeParsers/ListTypeParser';
import { parseMarkdownToDelimiter } from './BlockTypeParsers/DelimiterTypeParser';
import { parseMarkdownToCode } from './BlockTypeParsers/CodeTypeParser';
import { parseMarkdownToQuote } from './BlockTypeParsers/QuoteTypeParser';

export const editorData = [];

/**
 * Markdown Import class
 */
export default class MarkdownImporter {
  /**
   * creates the Importer plugin
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
      title: 'Import Markdown',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(112, 118, 132)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-fileUpload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
    };
  }

  /**
  * @return invinsible file upload form
  */
  render() {
    const doc = document.createElement('input');
    doc.setAttribute('id', 'file-upload');
    doc.setAttribute('type', 'file');
    doc.setAttribute('style', 'display: none');
    doc.setAttribute('name', 'files[]');
    doc.setAttribute('onload', this.parseMarkdown());

    return doc;
  }

  /**
  * Function which parses markdown file to JSON which correspons the the editor structure
  * @return Parsed markdown in JSON format
  */
  async parseMarkdown() {
    // empty the array before running the function again
    editorData.length = 0;

    const a = {};
    const data = await this.api.saver.save();
    a.content = data.blocks;

    const fileUpload = document.getElementById('file-upload');

    fileUpload.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;

        const parsedMarkdown = remark().parse(content);
        // iterating over the pared remarkjs syntax tree and executing the json parsers
        parsedMarkdown.children.forEach((item, index) => {
          switch (item.type) {
            case 'heading':
              return editorData.push(parseMarkdownToHeader(item));
            case 'paragraph':
              return editorData.push(parseMarkdownToParagraph(item));
            case 'list':
              return editorData.push(parseMarkdownToList(item));
            case 'thematicBreak':
              return editorData.push(parseMarkdownToDelimiter());
            case 'code':
              return editorData.push(parseMarkdownToCode(item));
            case 'blockquote':
              return editorData.push(parseMarkdownToQuote(item));
            default:
              break;
          }
        });
        // clear the editor
        this.api.blocks.clear();
        // render the editor with imported markdown data
        this.api.blocks.render({
          blocks: editorData.filter((value) => Object.keys(value).length !== 0), // filter through array and remove empty objects
        });

        return remark().parse(content);
      };
    };

    fileUpload.click();
  }

  save() {
    return {
      message: 'Uploading Markdown',
    };
  }
}
