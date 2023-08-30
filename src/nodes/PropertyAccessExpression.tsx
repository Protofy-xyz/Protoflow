import React, { memo } from 'react';
import { connectItem, dumpConnection, getId, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { BiTargetLock } from 'react-icons/bi';

const PropertyAccessExpression = (node) => {
    const { id, type } = node
    const nodeParams:Field[] = [
        { label: 'Name', field: 'name', type: 'input' },
        { label: 'Property', field: 'prop', type: 'input' },
    ]
    return (
        <Node icon={BiTargetLock} node={node} isPreview={!id} title={"property"} color={nodeColors[type]} id={id} params={nodeParams} />
    );;
}
PropertyAccessExpression.keyWords = ["property"]
PropertyAccessExpression.getData = (node, data, nodesData, edges) => {
    //connect all children in a line
    const name = node.getNameNode()
    const expression = node.getExpression()

    if(data[getId(expression)].type == 'data' && data[getId(name)].type == 'data') {
        return { type: 'data', value: data[getId(expression)].value+'.'+data[getId(name)].value}
    } else {
        return {
            name: connectItem(name, 'output', node, 'name', data, nodesData, edges, 'name'),
            prop: connectItem(expression, 'output', node, 'prop', data, nodesData, edges, 'prop'),
        }
    }
}

PropertyAccessExpression.checkCreate = (node, data) => {
    if(data[getId(node)].type == 'data') {
        return false
    }
    return true
}

PropertyAccessExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let name = dumpConnection(node, "target", "name", PORT_TYPES.data, data?.name ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)??''
    let prop = dumpConnection(node, "target", "prop", PORT_TYPES.data, data?.prop ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)??''
    return prop + '.' + name + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(PropertyAccessExpression)