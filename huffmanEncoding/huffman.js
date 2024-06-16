const fs = require('fs');

function buildFrequencyTable(text) {
    const frequencyTable = {};

    for (const char of text) {
        frequencyTable[char] = (frequencyTable[char] || 0) + 1;
    }

    return frequencyTable;
}

function readFileAndBuildFrequencyTable(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        const frequencyTable = buildFrequencyTable(data);

        // Logging frequency table for debugging
        // console.log('Frequency Table:');
        // for (const char in frequencyTable) {
        //     console.log(`${char}: ${frequencyTable[char]}`);
        // }

        return frequencyTable;
    } catch (error) {
        console.error('Error reading file:', error.message);
        return null;
    }
}

// Example usage with Les Misérables file
// const filename = './les_miserables.txt'; // Replace with the actual path
// readFileAndBuildFrequencyTable(filename);
module.exports = readFileAndBuildFrequencyTable;
