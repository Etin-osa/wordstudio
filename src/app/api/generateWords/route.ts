export async function POST(req: Request) {    
    const numVowels = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    const numConsonants = 9 - numVowels;
    const result: string[] = [];

    // Generate vowels
    for (let i = 0; i < numVowels; i++) {
        result.push(getRandomWeightedLetter(false, true));
    }
    
    // Generate consonants
    for (let i = 0; i < numConsonants; i++) {
        result.push(getRandomWeightedLetter(true, false));
    }

    // Shuffle the array
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return Response.json({ result });
}

function getRandomWeightedLetter(excludeVowels = false, excludeConsonants = false) {
    const letterFrequencies = {
      'a': 8.17, 'b': 1.49, 'c': 2.78, 'd': 4.25, 'e': 12.70, 'f': 2.23, 'g': 2.02, 
      'h': 6.09, 'i': 6.97, 'j': 0.15, 'k': 0.77, 'l': 4.03, 'm': 2.41, 'n': 6.75, 
      'o': 7.51, 'p': 1.93, 'q': 0.10, 'r': 5.99, 's': 6.33, 't': 9.06, 'u': 2.76, 
      'v': 0.98, 'w': 2.36, 'x': 0.15, 'y': 1.97, 'z': 0.07
    };

    const vowels = ['a', 'e', 'i', 'o', 'u'];
  
    // Filter letters based on parameters
    let filteredLetters: {[x: string]: number} = {};
    for (const [letter, frequency] of Object.entries(letterFrequencies)) {
        if ((excludeVowels && vowels.includes(letter)) || (excludeConsonants && !vowels.includes(letter))) {
            continue;
        }
        filteredLetters[letter] = frequency;
    }
    
    // Create array of letters and cumulative weights
    const letters = Object.keys(letterFrequencies);
    const weights = Object.values(letterFrequencies);
    
    // Calculate cumulative weights
    let cumulativeWeights = [];
    let cumulativeWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        cumulativeWeights.push(cumulativeWeight);
    }
    
    // Get a random value between 0 and the sum of all weights
    const random = Math.random() * cumulativeWeight;
    
    // Find the index of the first weight greater than the random value
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (random < cumulativeWeights[i]) {
            return letters[i];
        }
    }
    
    // Fallback (should never happen)
    return 'e';
}