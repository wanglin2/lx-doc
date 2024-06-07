import './style.css'

export default class SimpleLink {
  static get toolbox() {
    return {
      title: 'Link',
      icon: '<svg width="13" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.264 5.266l-1.854 1.854a3.722 3.722 0 0 1-5.256.008L9.416 10.5a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35z" transform="translate(-3.667 -2.7)"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  static get enableLineBreaks() {
    return true
  }

  constructor({ data, api, config, readOnly, block }) {
    this.api = api
    this.readOnly = readOnly
    this.wrapper = undefined
    this.data = {
      url: data.url || '',
      text: data.text || ''
    }
    this.isEdit = false
  }

  renderSettings() {
    if (this.readOnly) return []
    return [
      {
        icon: `<svg t="1717671961117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4268" width="128" height="128"><path d="M153.6 902.656a32.256 32.256 0 0 1 0-64h716.8a32.256 32.256 0 0 1 0 64zM743.936 151.04l72.192 72.192a51.2 51.2 0 0 1 0 72.192L358.4 751.616a51.2 51.2 0 0 1-36.352 14.848H226.816a25.6 25.6 0 0 1-25.6-25.6v-97.792a51.2 51.2 0 0 1 14.848-36.352l455.68-455.68a51.2 51.2 0 0 1 72.192 0z m-478.72 497.152v54.272h54.272l442.88-442.88L708.096 204.8z" fill="#5A5A68" p-id="4269"></path></svg>`,
        label: this.api.i18n.t('Edit label'),
        onActivate: () => {
          if (this.isEdit) return
          this.isEdit = true
          this.wrapper.innerHTML = this._createHtml(
            this.data.url,
            this.data.text
          )
        }
      }
    ]
  }

  render() {
    this.wrapper = this.make('div', 'link-wrapper')
    this.wrapper.addEventListener('click', this._onConfirm.bind(this))
    if (this.data && this.data.url) {
      this._showLinkPreview(this.data)
      return this.wrapper
    }
    if (this.readOnly) return
    this.isEdit = true
    this.wrapper.innerHTML = this._createHtml()
    return this.wrapper
  }

  _onConfirm(e) {
    if (!e.target.classList.contains('add-link')) return
    const linkInput = this.wrapper.querySelector('.link-url-field')
    const textInput = this.wrapper.querySelector('.link-name-field')
    if (
      linkInput.textContent &&
      /^https?:\/\//gim.test(linkInput.textContent)
    ) {
      this.data = {
        url: linkInput.textContent,
        text: textInput.textContent
      }
      this._showLinkPreview(this.data)
      this.isEdit = false
    }
  }

  _createHtml(url, name) {
    return `
      <div class="link-container">
        <div class="link-container-row">
          <span class="link-label">${this.api.i18n.t('Url label')}</span>
          <div class="link-field link-url-field" contentEditable="true">${
            url || ''
          }</div>
        </div>
        <div class="link-container-row">
          <span class="link-label">${this.api.i18n.t('Text label')}</span>
          <div class="link-field link-name-field" contentEditable="true">${
            name || ''
          }</div>
        </div>
      </div>
      <div class="add-link">${this.api.i18n.t('Confirm label')}</div>
    `
  }

  _showLinkPreview(linkData) {
    if (linkData && linkData.url) {
      const anchor = document.createElement('a')
      anchor.setAttribute('class', 'link-inserted')
      anchor.setAttribute('href', linkData.url)
      anchor.setAttribute('target', '_blank')
      anchor.textContent = linkData.text ? linkData.text : linkData.url
      this.wrapper.innerHTML = ''
      this.wrapper.appendChild(anchor)
    }
  }

  save(blockContent) {
    return this.data
  }

  validate(savedData) {
    if (!/^https?:\/\//gim.test(savedData.url)) {
      return false
    }
    return true
  }

  make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName)
    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else if (classNames) {
      el.classList.add(classNames)
    }
    for (const attrName in attributes) {
      el[attrName] = attributes[attrName]
    }
    return el
  }
}
