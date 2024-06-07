import ColorPlugin from 'editorjs-text-color-plugin'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import List from '@editorjs/list'
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote'
import Warning from '@editorjs/warning'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import Table from '@editorjs/table'
import Embed from '@editorjs/embed'
import EJLaTeX from 'editorjs-latex'
import 'editorjs-latex/dist/editorjs-latex.bundle.css'
import CodeTool from '@/plugins/code2'
import LinkTool from '@/plugins/link'
import { MDImporter, MDParser } from '@/plugins/markdown-parser'
import api from '@/api'

export const toolsConfig = {
  header: Header,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: async file => {
          try {
            console.log(file)
            const formData = new FormData()
            formData.append('file', file)
            const { data } = await api.uploadFiles(formData)
            return {
              success: 1,
              file: {
                url: data[0]
              }
            }
          } catch (e) {
            console.log(e)
            return {
              success: 0,
              file: {
                url: ''
              }
            }
          }
        }
      }
    }
  },
  list: List,
  checklist: Checklist,
  link: LinkTool,
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: '输入引用内容',
      captionPlaceholder: '输入来源'
    }
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: '标题',
      messagePlaceholder: '信息'
    }
  },
  code: {
    class: CodeTool,
    config: {}
  },
  delimiter: Delimiter,
  inlineCode: InlineCode,
  embed: Embed,
  table: Table,
  math: {
    class: EJLaTeX
  },
  markdownParser: MDParser,
  markdownImporter: MDImporter,
  color: {
    class: ColorPlugin,
    config: {
      colorCollections: [
        '#EC7878',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#0070FF',
        '#03A9F4',
        '#00BCD4',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFF'
      ],
      defaultColor: '#FF1300',
      type: 'text'
    }
  },
  marker: {
    class: ColorPlugin,
    config: {
      defaultColor: '#FFBF00',
      type: 'marker',
      icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
    }
  }
}

export const i18nConfig = {
  messages: {
    ui: {
      blockTunes: {
        toggler: {
          'Click to tune': '点击',
          'or drag to move': '拖动'
        }
      },
      inlineToolbar: {
        converter: {
          'Convert to': '转换为'
        }
      },
      toolbar: {
        toolbox: {
          Add: '添加',
          Filter: '搜索'
        }
      },
      popover: {
        'Nothing found': '没有结果',
        Filter: '搜索',
        'Convert to': '转换为'
      }
    },
    toolNames: {
      Text: '文本',
      Heading: '标题',
      List: '列表',
      Warning: '警告',
      Checklist: '任务清单',
      Quote: '引用',
      Code: '代码块',
      Delimiter: '分割线',
      Table: '表格',
      Link: '链接',
      Marker: '标记',
      Bold: '加粗',
      Italic: '斜体',
      InlineCode: '内联代码',
      Image: '图片',
      'Download Markdown': '导出为Markdown',
      'Import Markdown': '导入Markdown',
      Color: '颜色',
      Math: '数学公式'
    },
    tools: {
      warning: {
        Title: '标题',
        Message: '信息'
      },
      link: {
        'Edit label': '编辑1',
        'Url label': '地址1',
        'Text label': '名称1',
        'Confirm label': '确定1'
      },
      stub: {
        'The block can not be displayed correctly.': '块无法正确显示。'
      },
      image: {
        'Select an Image': '选择图片',
        'With border': '显示边框',
        'Stretch image': '拉伸图像',
        'With background': '显示背景',
        Caption: '描述'
      },
      table: {
        'Add column to left': '向左添加列',
        'Add column to right': '向右添加列',
        'Delete column': '删除列',
        'Add row above': '在上方添加行',
        'Add row below': '在下方添加行',
        'Delete row': '删除行',
        'With headings': '显示标题',
        'Without headings': '隐藏标题',
        Heading: '标题'
      },
      header: {
        'Heading 1': '一级标题',
        'Heading 2': '二级标题',
        'Heading 3': '三级标题',
        'Heading 4': '四级标题',
        'Heading 5': '五级标题',
        'Heading 6': '六级标题'
      },
      list: {
        Unordered: '无序',
        Ordered: '有序'
      },
      quote: {
        'Align Left': '左对齐',
        'Align Center': '居中对齐'
      }
    },
    blockTunes: {
      delete: {
        Delete: '删除'
      },
      moveUp: {
        'Move up': '上移'
      },
      moveDown: {
        'Move down': '下移'
      }
    }
  }
}
