// huffman.test.js
const { buildHuffmanTree } = require('./huffmanClass'); // Adjust the path based on your actual file structure
const readFileAndBuildFrequencyTable  = require('./huffman.js');
 const frequencyTable = readFileAndBuildFrequencyTable('./les_miserables.txt');
describe('Huffman Tree Building', () => {
    it('should build a valid Huffman tree', () => {
        frequencyTable

        const huffmanTree = buildHuffmanTree(frequencyTable);

        // Your assertions here to check if the resulting huffmanTree is as expected
        // For example, you can check the structure, frequencies, etc.

        // Example assertions (adjust based on your implementation and expectations)
        expect(huffmanTree.char).toBeNull(); // Root node doesn't represent a character
        expect(huffmanTree.frequency).toBe(223333); // Total frequency of the characters

        // Add more assertions based on the structure of your Huffman tree
    });
});
