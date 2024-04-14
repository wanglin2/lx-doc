const isDev = process.env.NODE_ENV === 'development'
const ip = '192.168.3.143'

// 打开编辑页面
export const openEditPage = (type, uid) => {
    switch (type) {
        case "whiteboard":
            localStorage.removeItem('excalidraw-state')
            localStorage.removeItem('excalidraw')
            location.href = (isDev ? `http://${ip}:3000/` : '../whiteboard/') + '?uid=' + uid
            break;
        case "mind":
            localStorage.removeItem('SIMPLE_MIND_MAP_DATA')
            location.href = (isDev ? `http://${ip}:8080/#/` : '../mind-map/#/') + uid
            break;
        case "bpmn":
            location.href = (isDev ? `http://${ip}:8082/#/bpmn/` : '../process/#/bpmn/') + uid
            break;
        case "markdown":
            location.href = (isDev ? `http://${ip}:3000/` : '../markdown-nice/') + '?uid=' + uid
            break;
        case "sheet":
            location.href = (isDev ? `http://${ip}:8083/` : '../sheet/') + '?uid=' + uid
            break;
        case "ppt":
            location.href = (isDev ? `http://${ip}:8084/` : '../PPTist/') + '?uid=' + uid
            break;
        case "doc":
            location.href = (isDev ? `http://${ip}:8085/` : '../docs/') + '?uid=' + uid
            break;
        case "process":
            location.href = (isDev ? `http://${ip}:8086/index.html` : '../flowchart/') + '?uid=' + uid
            break;
        case "whiteboard2":
            location.href = (isDev ? `http://${ip}:8087/` : '../whiteboard2/') + '?uid=' + uid
            break;
        case "resume":
            location.href = (isDev ? `http://${ip}:8088/` : '../resume/') + '?uid=' + uid
            break;
        default:
            break;
    }
}