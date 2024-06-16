const readFileAndBuildFrequencyTable = require('./huffman.js');
 const frequencyTable = readFileAndBuildFrequencyTable('./les_miserables.txt');
console.log("readd",frequencyTable);
class HuffmanNode {
    constructor(char, frequency) {
        this.char = char;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }
}

function buildHuffmanTree(frequencyTable) {
    const nodes = Object.entries(frequencyTable)
        .map(([char, frequency]) => new HuffmanNode(char, frequency));

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.frequency - b.frequency);

        const newNode = new HuffmanNode(null, nodes[0].frequency + nodes[1].frequency);
        newNode.left = nodes.shift();
        newNode.right = nodes.shift();

        nodes.push(newNode);
    }

    return nodes[0];
}

// Example usage with frequency table from Step 1

const huffmanTree = buildHuffmanTree(frequencyTable);

// Print the tree structure for debugging
console.log(JSON.stringify(huffmanTree, null, 2));

module.exports = { buildHuffmanTree };