export const approveNodes = [
    {
        type: 'apply',
        label: '申请',
        style: {
            width: '30px',
            height: '30px',
            borderRadius: '15px',
            border: '2px solid #FF6347',
        },
        property: {
            username: '',
            time: '',
            startTime: '',
            endTime: '',
        }
    },
    {
        type: 'approver',
        label: '审批',
        style: {
            width: '50px',
            height: '40px',
            borderRadius: '4px',
            border: '2px solid #3CB371',
        }
    },
    {
        type: 'jugement',
        label: '判断',
        style: {
            width: '30px',
            height: '30px',
            border: '2px solid #6495ED',
            transform: 'rotate(45deg)',
        }
    },
    {
        type: 'finsh',
        label: '结束',
        style: {
            width: '30px',
            height: '30px',
            borderRadius: '15px',
            border: '2px solid #E6A23C',
        }
    },
];

// 主题
export const themeApprove = {
    rect: { // 矩形样式
        radius: 8,
        stroke: '#3CB371'
    },
    circle: {
        r: 25,
        stroke: '#FF6347'
    },
    polygon: {
        stroke: '#6495ED',
    },
    polyline: {
        strokeWidth: 1,
    },
    edgeText: {
        background: {
            fill: 'white',
        },
    },
}

// 字号列表
export const fontSizeList = [
    {
        label: '12px',
        value: 12
    },
    {
        label: '14px',
        value: 14
    },
    {
        label: '16px',
        value: 16
    },
    {
        label: '18px',
        value: 18
    },
    {
        label: '20px',
        value: 20
    },
    {
        label: '24px',
        value: 24
    },
    {
        label: '30px',
        value: 30
    }
]

// 边框大小列表
export const strokeWidthList = [
    {
        label: '无',
        value: 0
    },
    {
        label: '2px',
        value: 2
    },
    {
        label: '4px',
        value: 4
    },
    {
        label: '6px',
        value: 6
    },
    {
        label: '8px',
        value: 8
    }
]

export const data = {

}

