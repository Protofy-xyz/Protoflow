import React, { useContext } from 'react';
import { dumpConnection, connectItem, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { nodeColors } from '.';
import { Code } from 'lucide-react';
import { DataOutput } from '../lib/types';

const JsxExpression = (node) => {
    const { id, type } = node
    const nodeParams: Field[] = [
        { label: '{jsx}', field: 'expression', type: 'input', description: 'JsxExpression' }
    ]

    return (
        <Node icon={Code}  node={node} isPreview={!id} title={"{Jsx}"} id={id} params={nodeParams} color={nodeColors[type]} dataOutput = {DataOutput.jsx}/>
    );
}
JsxExpression.keyWords = ["jsx", "jsxexpression", "expression", "tsx", "{}"]
JsxExpression.defaultHandle = PORT_TYPES.data + 'expression'

JsxExpression.getData = (node, data, nodesData, edges) => {
    return {
        expression: connectItem(node.getExpression(), 'output', node, 'expression', data, nodesData, edges, 'expression')??''
    }
}

JsxExpression.dataOutput = DataOutput.jsx
JsxExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let expression = dumpConnection(node, "target", "expression", PORT_TYPES.data, data?.expression??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    const a = `{${expression}}`+ dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return a
}

export default React.memo(JsxExpression)