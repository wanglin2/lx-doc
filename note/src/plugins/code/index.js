import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const DEFAULT_THEMES = ['light', 'dark']
const COMMON_LANGUAGES = {
  none: 'Auto-detect',
  apache: 'Apache',
  bash: 'Bash',
  cs: 'C#',
  cpp: 'C++',
  css: 'CSS',
  coffeescript: 'CoffeeScript',
  diff: 'Diff',
  go: 'Go',
  html: 'HTML, XML',
  http: 'HTTP',
  json: 'JSON',
  java: 'Java',
  javascript: 'JavaScript',
  kotlin: 'Kotlin',
  less: 'Less',
  lua: 'Lua',
  makefile: 'Makefile',
  markdown: 'Markdown',
  nginx: 'Nginx',
  objectivec: 'Objective-C',
  php: 'PHP',
  perl: 'Perl',
  properties: 'Properties',
  python: 'Python',
  ruby: 'Ruby',
  rust: 'Rust',
  scss: 'SCSS',
  sql: 'SQL',
  shell: 'Shell Session',
  swift: 'Swift',
  toml: 'TOML, also INI',
  typescript: 'TypeScript',
  yaml: 'YAML',
  plaintext: 'Plaintext'
}

class CodeBox {
  constructor({ data, api, config }) {
    this.api = api
    this.config = {
      themeName:
        config.themeName && typeof config.themeName === 'string'
          ? config.themeName
          : '',
      themeURL:
        config.themeURL && typeof config.themeURL === 'string'
          ? config.themeURL
          : '',
      useDefaultTheme:
        config.useDefaultTheme &&
        typeof config.useDefaultTheme === 'string' &&
        DEFAULT_THEMES.includes(config.useDefaultTheme.toLowerCase())
          ? config.useDefaultTheme
          : 'dark'
    }
    this.data = {
      code: data.code && typeof data.code === 'string' ? data.code : '',
      language:
        data.language && typeof data.language === 'string'
          ? data.language
          : 'Auto-detect'
    }
    this.highlightScriptID = 'highlightJSScriptElement'
    this.highlightCSSID = 'highlightJSCSSElement'
    this.codeArea = document.createElement('code')
    this.selectInput = document.createElement('input')
    this.selectDropIcon = document.createElement('i')

    this.api.listeners.on(window, 'click', this._closeAllLanguageSelects, true)
  }

  static get sanitize() {
    return {
      code: true,
      language: false,
      theme: false
    }
  }

  static get toolbox() {
    return {
      title: 'CodeBox',
      icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.71,6.29a1,1,0,0,0-1.42,0l-5,5a1,1,0,0,0,0,1.42l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L5.41,12l4.3-4.29A1,1,0,0,0,9.71,6.29Zm11,5-5-5a1,1,0,0,0-1.42,1.42L18.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5A1,1,0,0,0,20.71,11.29Z"/></svg>'
    }
  }

  static get displayInToolbox() {
    return true
  }

  static get enableLineBreaks() {
    return true
  }

  render() {
    const codeAreaHolder = document.createElement('pre')
    const languageSelect = this._createLanguageSelectElement()

    codeAreaHolder.setAttribute('class', 'codeBoxHolder')
    this.codeArea.setAttribute(
      'class',
      `codeBoxTextArea ${this.config.useDefaultTheme} ${this.data.language}`
    )
    this.codeArea.setAttribute('contenteditable', 'true')
    this.codeArea.innerHTML = this.data.code
    this.api.listeners.on(
      this.codeArea,
      'blur',
      event => this._highlightCodeArea(event),
      false
    )
    this.api.listeners.on(
      this.codeArea,
      'paste',
      event => this._handleCodeAreaPaste(event),
      false
    )

    codeAreaHolder.appendChild(this.codeArea)
    codeAreaHolder.appendChild(languageSelect)

    return codeAreaHolder
  }

  save(blockContent) {
    return Object.assign(this.data, {
      code: this.codeArea.innerHTML
    })
  }

  validate(savedData) {
    if (!savedData.code.trim()) return false
    return true
  }

  destroy() {
    this.api.listeners.off(window, 'click', this._closeAllLanguageSelects, true)
    this.api.listeners.off(
      this.codeArea,
      'blur',
      event => this._highlightCodeArea(event),
      false
    )
    this.api.listeners.off(
      this.codeArea,
      'paste',
      event => this._handleCodeAreaPaste(event),
      false
    )
    this.api.listeners.off(
      this.selectInput,
      'click',
      event => this._handleSelectInputClick(event),
      false
    )
  }

  _createLanguageSelectElement() {
    const selectHolder = document.createElement('div')
    const selectPreview = document.createElement('div')
    const languages = Object.entries(COMMON_LANGUAGES)

    selectHolder.setAttribute('class', 'codeBoxSelectDiv')

    this.selectDropIcon.setAttribute(
      'class',
      `codeBoxSelectDropIcon ${this.config.useDefaultTheme}`
    )
    this.selectDropIcon.innerHTML = '&#8595;'
    this.selectInput.setAttribute(
      'class',
      `codeBoxSelectInput ${this.config.useDefaultTheme}`
    )
    this.selectInput.setAttribute('type', 'text')
    this.selectInput.setAttribute('readonly', 'true')
    this.selectInput.value = this.data.language
    this.api.listeners.on(
      this.selectInput,
      'click',
      event => this._handleSelectInputClick(event),
      false
    )

    selectPreview.setAttribute('class', 'codeBoxSelectPreview')

    languages.forEach(language => {
      const selectItem = document.createElement('p')
      selectItem.setAttribute(
        'class',
        `codeBoxSelectItem ${this.config.useDefaultTheme}`
      )
      selectItem.setAttribute('data-key', language[0])
      selectItem.textContent = language[1]
      this.api.listeners.on(
        selectItem,
        'click',
        event => this._handleSelectItemClick(event, language),
        false
      )

      selectPreview.appendChild(selectItem)
    })

    selectHolder.appendChild(this.selectDropIcon)
    selectHolder.appendChild(this.selectInput)
    selectHolder.appendChild(selectPreview)

    return selectHolder
  }

  _highlightCodeArea(event) {
    this.codeArea.removeAttribute('data-highlighted')
    hljs.highlightElement(this.codeArea, { language: this.data.language })
  }

  _handleCodeAreaPaste(e) {
    e.stopPropagation()
    e.preventDefault()
    const paste = (e.clipboardData || window.clipboardData).getData('text')
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    selection.deleteFromDocument()
    selection.getRangeAt(0).insertNode(document.createTextNode(paste))
    selection.collapseToEnd()
  }

  _handleSelectInputClick(event) {
    event.target.nextSibling.classList.toggle('codeBoxShow')
  }

  _handleSelectItemClick(event, language) {
    event.target.parentNode.parentNode.querySelector(
      '.codeBoxSelectInput'
    ).value = language[1]
    event.target.parentNode.classList.remove('codeBoxShow')
    this.codeArea.removeAttribute('class')
    this.data.language = language[0]
    this.codeArea.setAttribute(
      'class',
      `codeBoxTextArea ${this.config.useDefaultTheme} ${this.data.language}`
    )
    hljs.highlightElement(this.codeArea)
  }

  _closeAllLanguageSelects() {
    const selectPreviews = document.querySelectorAll('.codeBoxSelectPreview')
    for (let i = 0, len = selectPreviews.length; i < len; i++)
      selectPreviews[i].classList.remove('codeBoxShow')
  }
}

export default CodeBox
