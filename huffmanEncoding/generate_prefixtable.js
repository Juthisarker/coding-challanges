// Assuming the HuffmanNode class is already defined as in huffman.js
const { buildHuffmanTree } = require('./huffmanClass');
function generatePrefixCodeTable(tree) {
    const prefixCodeTable = {};

    function traverse(node, currentCode) {
        if (node.char !== null) {
            // If the node represents a character, add it to the prefixCodeTable
            prefixCodeTable[node.char] = currentCode;
        }

        // Traverse the left branch with '0'
        if (node.left) {
            traverse(node.left, currentCode + '0');
        }

        // Traverse the right branch with '1'
        if (node.right) {
            traverse(node.right, currentCode + '1');
        }
    }

    // Start the traversal from the root with an empty code
    traverse(tree, '');

    return prefixCodeTable;
}

// Example usage:
const frequencyTable = { 'a': 4, 'b': 3, 'c': 2, 'd': 1 };
const huffmanTree = buildHuffmanTree(frequencyTable);
const prefixCodeTable = generatePrefixCodeTable(huffmanTree);

console.log(prefixCodeTable);
