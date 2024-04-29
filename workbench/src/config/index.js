import logoUrl from '@/assets/img/logo.svg'

export default {
  // logo
  logo: logoUrl,
  // 名称
  name: '理想文档',
  // 可创建的文件类型
  createTypeList: [
    {
      name: '白板',
      value: 'whiteboard',
      icon: 'icon-baiban',
      color: ''
    },
    {
      name: '思维导图',
      value: 'mindMap',
      icon: 'icon-siweidaotu',
      color: '#32ca7f'
    },
    {
      name: '流程图',
      value: 'process',
      icon: 'icon-flowChart',
      color: '#5178fb'
    },
    {
      name: 'Markdown',
      value: 'markdown',
      icon: 'icon-markdown',
      color: '#ff4663'
    },
    {
      name: '文档',
      value: 'doc',
      icon: 'icon-shiyongwendang',
      color: '#6674a6'
    },
    {
      name: '电子表格',
      value: 'sheet',
      icon: 'icon-biaoge',
      color: '#68d3c9'
    },
    {
      name: '幻灯片',
      value: 'ppt',
      icon: 'icon-preview24',
      color: '#f17b77'
    },
    {
      name: 'BPMN',
      value: 'bpmn',
      icon: 'icon-icon',
      color: '#4eaef0'
    },
    {
      name: '简历',
      value: 'resume',
      icon: 'icon-resume-line',
      color: '#ffc038'
    }
  ]
}
