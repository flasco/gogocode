const { isObject } = require('../util')

// 查找时 ast 无用属性，这些属性的保留（如行数信息）会干扰节点的匹配，所以需要过滤掉
const Props = [
    'computed',
    'range',
    'loc',
    'type',
    'raw',
    'start',
    'end',
    'leadingComments',
    'shorthand',
    'extra',
    'static',
    'typeParameters'
]

const filterProps = function (node, structure, propList, expando) {
    const props = propList || Props;
    for (const key in node) {
        // 过滤值为空的字段
        if ((key === 'type' && node[key] === 'Super') || (props.indexOf(key) == -1 && node[key])) {
            if (isObject(node[key])) {
                if (Array.isArray(node[key])) {
                    structure[key] = [];
                    node[key].forEach((n, i) => {
                        structure[key][i] = {};
                        filterProps(n, structure[key][i], props);
                    });
                } else {
                    structure[key] = {};
                    filterProps(node[key], structure[key], props);
                }
            } else if (node[key] == '$_$') {
                node[key] = expando;
                structure[key] = node[key];
            } else {
                structure[key] = node[key];
            }
        }
    }
}

module.exports = filterProps;