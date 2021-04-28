function treeNormalizer(node){
        return {
            id: node.id,
            label: node.name,
            children: node.children && node.children.length ? node.children : undefined,
        };
}

export default treeNormalizer;