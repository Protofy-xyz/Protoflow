import React from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { MdOutlineAvTimer } from 'react-icons/md';


const AwaitExpression =(node) => {
    const { id, type } = node
    const nodeParams: Field[] = [
        { label: 'Value', field: 'value', type: 'input'},
    ]

    return (
        <Node icon={MdOutlineAvTimer} node={node} isPreview={!id} title={"await"} id={id} params={nodeParams} color={nodeColors[type]}/>
    );
}
AwaitExpression.keyWords = ['await']
AwaitExpression.getData = (node, data, nodesData, edges) => {
    return {
        value: connectItem(node?.getExpression(), 'output', node, 'value', data, nodesData, edges, 'value'),
    }
}

AwaitExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let value = dumpConnection(node, "target", "value", PORT_TYPES.data, data?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return 'await ' + value
}

export default React.memo(AwaitExpression)