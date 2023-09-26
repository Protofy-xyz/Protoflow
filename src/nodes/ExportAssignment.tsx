import React from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { FileSymlink } from 'lucide-react';
import { DataOutput } from '../lib/types';


const ExportAssignment =(node) => {
    const { id, type } = node
    const nodeParams: Field[] = [
        { label: 'Value', field: 'value', type: 'input'},
    ]

    return (
        <Node icon={FileSymlink} node={node} isPreview={!id} title={"export default"} id={id} params={nodeParams} color={nodeColors[type]} dataOutput={DataOutput.flow}/>
    );
}

ExportAssignment.keyWords = ["export default"]
ExportAssignment.getData = (node, data, nodesData, edges) => {
    return {
        value: connectItem(node?.getExpression(), 'output', node, 'value', data, nodesData, edges, 'value'),
    }
}
ExportAssignment.dataOutput = DataOutput.flow

ExportAssignment.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let value = dumpConnection(node, "target", "value", PORT_TYPES.data, data?.value??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return 'export default ' + value
}

export default React.memo(ExportAssignment)



