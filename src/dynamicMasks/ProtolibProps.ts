import { FlowStoreContext } from "../store/FlowsStore"
import { useContext } from 'react';

export const getProtolibParams = (enabledProps = ["*"]) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    
    const allPropsEnabled = enabledProps[0] == "*"

    const colors = Object.keys(metadata?.tamagui?.color ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.color[k].key + '"')
    const sizes = Object.keys(metadata?.tamagui?.size ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.size[k].key + '"')
    const radiuses = Object.keys(metadata?.tamagui?.radius ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.radius[k].key + '"')
    const spaces = Object.keys(metadata?.tamagui?.space ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.space[k].key + '"')
    const zIndexes = Object.keys(metadata?.tamagui?.zIndex ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.zIndex[k].key + '"')
    const defaultValue = undefined

    const textAlingments = ['"auto"' , '"left"' , '"right"' , '"center"' , '"justify"' ]

    return [
        { field: 'prop-bgColor', label: 'bgColor', type: 'select', fieldType: 'prop', data: colors ? [defaultValue, ...colors] : [], static: true },
        { field: 'prop-fontSize', label: 'fontSize', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        { field: 'prop-color', label: 'color', type: 'select', fieldType: 'prop', data: colors ? [defaultValue, ...colors] : [], static: true },
        { field: 'prop-br', label: 'br', type: 'select', fieldType: 'prop', data: radiuses ? [defaultValue, ...radiuses] : [], static: true },
        { field: 'prop-bw', label: 'bw', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        { field: 'prop-size', label: 'size', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        { field: 'prop-textAlign', label: 'textAlign', type: 'select', fieldType: 'prop', data: [defaultValue, ...textAlingments], static: true },
        { field: 'prop-margin', label: 'margin', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        { field: 'prop-padding', label: 'padding', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        { field: 'prop-space', label: 'space', type: 'select', fieldType: 'prop', data: spaces ? [defaultValue, ...spaces] : [], static: true },
        { field: 'prop-zi', label: 'zi', type: 'select', fieldType: 'prop', data: zIndexes ? [defaultValue, ...zIndexes] : [], static: true },
    ].filter(item =>  allPropsEnabled || enabledProps.includes(item.label))
}

export const getProtolibProps = () => {
    const params = getProtolibParams()
    return params.map(p => p.field)
}