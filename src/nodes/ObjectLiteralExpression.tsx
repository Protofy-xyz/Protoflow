import React, { useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType, getTrivia } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { nodeColors } from '.';
import AddPropButton from '../AddPropButton';
import { generateId } from '../lib/IdGenerator';
import { FlowStoreContext } from "../store/FlowsStore";
import { TableProperties } from 'lucide-react';

export const ObjectFactory = (objectType) => {
    const component = (node) => {
        const { id, type } = node
        const useFlowsStore = useContext(FlowStoreContext)
        const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
        const extraProps = nodeData.mode == 'json' ? { keyPre: (str) => str.replace(/^(["'])|(["'])$/g, ''), keyPost: (str) => '"' + str + '"' } : {}
        const nodeParams: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('param-')).map((param: any, i) => {
            const additionalHandlePort = nodeData.mode == 'json' ? {} : { additionalHandlePort: 'key' }
            return { label: param.substr(6), field: param, fieldType: 'parameter', deleteable: true, ...additionalHandlePort, ...extraProps } as Field
        })

        return (
            <Node icon={TableProperties} node={node} isPreview={!id} title={objectType == 'typeLiteral' ? "type literal" : "Object"} id={id} color={nodeColors[type]}>
                <div style={{ height: '5px' }}></div>
                <NodeParams id={id} params={nodeParams} />
                <AddPropButton label={"Add Property"} id={id} nodeData={nodeData} />
            </Node>
        );
    }
    component.keyWords = ["Object"]
    component.getData = (node, data, nodesData, edges, mode) => {
        return {
            ...node[objectType == 'typeLiteral' ? 'getMembers' : 'getProperties']().reduce((obj, prop, i) => {
                const uuid = generateId()
                let sourceKey;
                let sourceValue;
                if (prop.getKindName() == 'SpreadAssignment') {
                    sourceKey = connectItem(prop, 'output', node, 'param-' + uuid + '-key', data, nodesData, edges)
                } else {
                    sourceKey = prop.getName()
                    sourceValue = objectType == 'typeLiteral' 
                                    ? prop.getType().getText()
                                    : (prop.getInitializer() ? connectItem(prop.getInitializer(), 'output', node, 'param-' + uuid, data, nodesData, edges, 'param-' + uuid) : '' )
                }

                return {
                    ...obj,
                    ['param-' + uuid]: {
                        key: sourceKey ?? '',
                        value: sourceValue ?? ''
                    },
                    ['trivia-param-' + uuid]: getTrivia(prop),
                    mode: mode
                }
            }, {

            })
        }
    }

    component.onDeleteConnection = (data, deletedKey) => {
        return {
            ...data,
            [deletedKey]: { ...data[deletedKey], value: '' }
        }
    }

    function getTriviaBeforeCloseBrace(objectLiteralNode) {
        const fullText = objectLiteralNode.getSourceFile().getFullText();
        const lastChild = objectLiteralNode.getLastChild();

        if (lastChild && lastChild.getKindName() === 'CloseBraceToken') {
            const leadingTriviaWidth = lastChild.getLeadingTriviaWidth();
            const triviaBeforeCloseBrace = fullText.substring(lastChild.getPos(), lastChild.getPos() + leadingTriviaWidth);

            return triviaBeforeCloseBrace;
        }
        return '';
    }


    component.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0, trivia) => {
        const data = nodesData[node.id] ?? {};
        const space = data._astNode ? "" : " "
        const fromFile = data._astNode ? true : false

        const params = Object.keys(data).filter(key => key.startsWith('param')).map((param) => {
            let key = data[param]?.key ?? "";
            const triviaInfo: any = {}
            const objValue = dumpConnection(node, "target", param, PORT_TYPES.data, data[param]?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level + 1, triviaInfo)
            const objParam = key + (!objValue ? "" : (":" + space + objValue))
            return { code: objParam, trivia: triviaInfo['content'], paramTrivia: data['trivia-' + param] }
        })

        const ending = dumpType == 'partial' ? '' : fromFile ? getTriviaBeforeCloseBrace(data._astNode) : "\n" + "\t".repeat(level - 1)

        return "{"
            + params.reduce((total, p, i) => {
                const triviaCode = dumpType == 'partial' ? '' : (p.paramTrivia !== undefined ? p.paramTrivia : "\n" + "\t".repeat(level))
                return total + triviaCode + p.code + (i < params.length - 1 ? ',' : '')
            }, '')
            + ending
            + "}"
            + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    }

    return component

}
const ObjectNode = ObjectFactory('objectLiteral')
export default React.memo(ObjectNode)
