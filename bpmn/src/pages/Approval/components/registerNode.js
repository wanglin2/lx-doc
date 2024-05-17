import LogicFlow, {
  BaseNodeModel,
  ConnectRule,
  CircleNodeModel,
  CircleNode,
  RectNode,
  RectNodeModel,
  h,
  PolygonNode,
  PolygonNodeModel,
  PolylineEdge,
  PolylineEdgeModel,
} from '@logicflow/core';

export default function RegisteNode(lf) {
  // 申请节点----------------------------------------
  class ApplyNodeModel extends CircleNodeModel {
    constructor(data, graphModel) {
      super(data, graphModel);
      this.properties = {
        color: '#000000',
        fontSize: 14,
        stroke: '#FF6347',
        strokeDash: 0,
        strokeWidth: 2,
        fill: '#fff',
        radius: 50,
      }
    }

    getConnectedTargetRules() {
      const rules = super.getConnectedTargetRules();
      const geteWayOnlyAsTarget = {
        message: '开始节点只能连出，不能连入！',
        validate: (source, target) => {
          let isValid = true;
          if (target) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }

    getTextStyle() {
      const style = super.getTextStyle();
      let { color, fontSize } = this.properties;
      style.fontSize = fontSize;
      style.color = color;
      return style;
    }

    getNodeStyle() {
      const style = super.getNodeStyle();
      let { stroke, strokeDash, strokeWidth, fill } = this.properties;
      style.stroke = stroke;
      style.strokeDasharray = strokeDash;
      style.strokeWidth = strokeWidth;
      style.fill = fill;
      return style;
    }

    setAttributes() {
      const { radius } = this.properties;
      this.r = radius === undefined ? 50 : radius;
    }
  }
  lf.register({
    type: 'apply',
    view: CircleNode,
    model: ApplyNodeModel,
  })

  // 审批节点----------------------------------------
  class ApproverNode extends RectNode {
    static extendKey = 'UserTaskNode';

    getLabelShape() {
      const {
        x,
        y,
        width,
        height,
        properties,
      } = this.props.model;
      const { labelColor, approveTypeLabel } = properties;
      return h(
        'text',
        {
          fill: labelColor,
          fontSize: 12,
          x: x - width / 2 + 5,
          y: y - height / 2 + 15,
          width: 50,
          height: 25
        },
        approveTypeLabel,
      );
    }
    getShape() {
      const {
        x,
        y,
        width,
        height,
        radius,
      } = this.props.model;
      const style = this.props.model.getNodeStyle();
      return h(
        'g',
        {
        },
        [
          h(
            'rect',
            {
              ...style,
              x: x - width / 2,
              y: y - height / 2,
              rx: radius,
              ry: radius,
              width,
              height,
            },
          ),
          this.getLabelShape(),
        ],
      );
    }
  }
  class ApproverModel extends RectNodeModel {
    constructor(data, graphModel) {
      super(data, graphModel);
      this.properties = {
        labelColor: '#000000',
        approveTypeLabel: '',
        color: '#000000',
        fontSize: 14,
        stroke: '#3CB371',
        strokeDash: 0,
        strokeWidth: 2,
        fill: '#fff',
        width: 100,
        height: 80
      }
    }

    getTextStyle() {
      const style = super.getTextStyle();
      let { color, fontSize } = this.properties;
      style.fontSize = fontSize;
      style.color = color;
      return style;
    }

    getNodeStyle() {
      const style = super.getNodeStyle();
      let { stroke, strokeDash, strokeWidth, fill } = this.properties;
      style.stroke = stroke;
      style.strokeDasharray = strokeDash;
      style.strokeWidth = strokeWidth;
      style.fill = fill;
      return style;
    }

    setAttributes() {
      const { width, height } = this.properties;
      this.width = width === undefined ? 100 : width;
      this.height = height === undefined ? 100 : height;
    }
  }

  lf.register({
    type: 'approver',
    view: ApproverNode,
    model: ApproverModel,
  })

  // 判断节点----------------------------------------
  class JugementModel extends PolygonNodeModel {
    constructor(data, graphModel) {
      super(data, graphModel);
      this.points = [
        [60, 0],
        [120, 40],
        [60, 80],
        [0, 40],
      ];
      this.properties = {
        color: '#000000',
        fontSize: 14,
        stroke: '#6495ED',
        strokeDash: 0,
        strokeWidth: 2,
        fill: '#fff',
        width: 120,
        height: 80
      }
    }

    getTextStyle() {
      const style = super.getTextStyle();
      let { color, fontSize } = this.properties;
      style.fontSize = fontSize;
      style.color = color;
      return style;
    }

    getNodeStyle() {
      const style = super.getNodeStyle();
      let { stroke, strokeDash, strokeWidth, fill } = this.properties;
      style.stroke = stroke;
      style.strokeDasharray = strokeDash;
      style.strokeWidth = strokeWidth;
      style.fill = fill;
      return style;
    }

    setAttributes() {
      const { width, height } = this.properties;
      this.points = [
        [width / 2, 0],
        [width, height / 2],
        [width / 2, height],
        [0, height / 2],
      ];
    }
  }
  lf.register({
    type: 'jugement',
    view: PolygonNode,
    model: JugementModel,
  });

  // 结束节点----------------------------------------
  class FinshNodeModel extends CircleNodeModel {
    constructor(data, graphModel) {
      super(data, graphModel);
      this.properties = {
        color: '#000000',
        fontSize: 14,
        stroke: '#E6A23C',
        strokeDash: 0,
        strokeWidth: 2,
        fill: '#fff'
      }
    }

    getConnectedSourceRules() {
      const rules = super.getConnectedSourceRules();
      const geteWayOnlyAsTarget = {
        message: '结束节点只能连入，不能连出！',
        validate: (source) => {
          let isValid = true;
          if (source) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }

    getTextStyle() {
      const style = super.getTextStyle();
      let { color, fontSize } = this.properties;
      style.fontSize = fontSize;
      style.color = color;
      return style;
    }

    getNodeStyle() {
      const style = super.getNodeStyle();
      let { stroke, strokeDash, strokeWidth, fill } = this.properties;
      style.stroke = stroke;
      style.strokeDasharray = strokeDash;
      style.strokeWidth = strokeWidth;
      style.fill = fill;
      return style;
    }
  }
  lf.register({
    type: 'finsh',
    view: CircleNode,
    model: FinshNodeModel,
  })


  // 自定义折线边 -----------------------------------------
  class CustomPolylineEdgeModel extends PolylineEdgeModel {
    constructor(...args) {
      super(...args);
      this.properties = {
        color: '#000000',
        fontSize: 14,
        stroke: '#000000',
        strokeDash: 0,
        strokeWidth: 2,
        textFill: '#ffffff'
      }
    }

    getEdgeStyle() {
      const style = super.getEdgeStyle();
      const { stroke, strokeDash, strokeWidth } = this.properties;
      style.stroke = stroke;
      style.strokeDasharray = strokeDash;
      style.strokeWidth = strokeWidth;
      return style;
    }

    getTextStyle() {
      const style = super.getTextStyle();
      const { color, fontSize, textFill } = this.properties;
      style.color = color;
      style.fontSize = fontSize;
      style.background.fill = textFill;
      return style;
    }
  }

  lf.register({
    type: 'customPolylineEdge',
    view: PolylineEdge,
    model: CustomPolylineEdgeModel,
  })
}
