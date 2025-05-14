/**
 * Search Enhancement Service
 * 
 * Provides advanced search capabilities including:
 * - Autocomplete suggestions
 * - Synonym matching
 * - Misspelling correction
 */

// Common financial and remittance terms with their synonyms
const SYNONYMS: Record<string, string[]> = {
  // Transaction terms
  'transaction': ['transfer', 'payment', 'remittance', 'wire', 'send'],
  'send': ['transfer', 'remit', 'wire', 'transmit'],
  'receive': ['collect', 'accept', 'get', 'withdraw'],
  'money': ['funds', 'cash', 'currency', 'payment'],
  'payment': ['transaction', 'transfer', 'remittance'],
  'deposit': ['lodge', 'credit', 'pay in'],
  'withdraw': ['take out', 'cash out', 'pull out'],
  
  // Status terms
  'pending': ['processing', 'in progress', 'ongoing', 'awaiting'],
  'completed': ['finished', 'done', 'processed', 'successful'],
  'failed': ['unsuccessful', 'declined', 'rejected', 'error'],
  'cancelled': ['stopped', 'terminated', 'aborted'],
  
  // Client terms
  'client': ['customer', 'user', 'sender', 'recipient', 'beneficiary'],
  'customer': ['client', 'user', 'patron'],
  'sender': ['remitter', 'originator', 'payer'],
  'recipient': ['beneficiary', 'receiver', 'payee', 'destination'],
  
  // Document terms
  'document': ['id', 'identification', 'paperwork', 'file'],
  'identification': ['id', 'identity', 'proof', 'document'],
  'passport': ['travel document', 'id'],
  'license': ['permit', 'id', 'card'],
  
  // Currency terms
  'exchange': ['forex', 'conversion', 'rate', 'fx'],
  'rate': ['price', 'value', 'exchange', 'conversion'],
  'currency': ['money', 'tender', 'exchange', 'denomination'],
  
  // Help terms
  'help': ['support', 'assistance', 'guide', 'aid', 'faq'],
  'guide': ['tutorial', 'instructions', 'help', 'manual']
};

// Common misspellings of financial terms
const MISSPELLINGS: Record<string, string[]> = {
  'transaction': ['transacton', 'transection', 'transation', 'trnsaction'],
  'transfer': ['tranfer', 'transfor', 'transfar', 'transpher'],
  'payment': ['payement', 'payemnt', 'paiment', 'paymant'],
  'remittance': ['remitance', 'remitence', 'remitanse', 'remitence'],
  'exchange': ['exchnage', 'exhange', 'exchagne', 'exhcange'],
  'currency': ['currancy', 'curency', 'curreny', 'currensy'],
  'recipient': ['recipent', 'recepient', 'reciepent', 'recipiant'],
  'beneficiary': ['benificiary', 'beneficary', 'benificiary', 'beneficery'],
  'document': ['documnet', 'docment', 'documant', 'documente'],
  'identification': ['identifcation', 'idntification', 'identifikation', 'identifaction'],
  'account': ['acount', 'accont', 'acconut', 'accuont'],
  'balance': ['balence', 'ballance', 'balanse', 'balence'],
  'deposit': ['deposite', 'diposit', 'depositt', 'deposet'],
  'withdraw': ['withdrawl', 'whitdraw', 'widraw', 'withdrow'],
  'client': ['clint', 'cleint', 'cliend', 'clyent'],
  'customer': ['custmer', 'customar', 'cusomer', 'custommer']
};

// Autocomplete suggestions based on common search patterns
const AUTOCOMPLETE_SUGGESTIONS: Record<string, string[]> = {
  'tr': ['transaction', 'transfer', 'tracking', 'transit'],
  'se': ['send money', 'sender', 'settings', 'security'],
  'pa': ['payment', 'passport', 'past transactions', 'pay out'],
  're': ['receive money', 'recipient', 'remittance', 'recent transactions'],
  'ex': ['exchange rate', 'export', 'external transfer', 'expiry date'],
  'cu': ['currency', 'customer', 'current rate', 'custom fee'],
  'do': ['document', 'download receipt', 'domestic transfer', 'dormant account'],
  'id': ['identification', 'id card', 'id verification', 'id number'],
  'ba': ['balance', 'bank account', 'batch transfer', 'back office'],
  'wi': ['withdraw', 'wire transfer', 'withholding tax', 'window'],
  'ca': ['cash', 'card', 'cancel transaction', 'calculate fee'],
  'mo': ['money', 'mobile number', 'monthly statement', 'more options'],
  'he': ['help', 'help center', 'help desk', 'help article'],
  'su': ['support', 'summary', 'successful transaction', 'suspend account'],
  'cl': ['client', 'close account', 'clear form', 'client details']
};

/**
 * Get autocomplete suggestions based on the current query
 * @param query Current search query
 * @param limit Maximum number of suggestions to return
 * @returns Array of autocomplete suggestions
 */
export function getAutocompleteSuggestions(query: string, limit = 5): string[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  let suggestions: string[] = [];
  
  // Check for exact prefix matches in autocomplete dictionary
  for (const [prefix, words] of Object.entries(AUTOCOMPLETE_SUGGESTIONS)) {
    if (normalizedQuery.startsWith(prefix)) {
      suggestions.push(...words);
    }
  }
  
  // Add any terms that start with the query
  Object.keys(SYNONYMS).forEach(term => {
    if (term.startsWith(normalizedQuery) && !suggestions.includes(term)) {
      suggestions.push(term);
    }
  });
  
  // Add synonyms of terms that start with the query
  Object.entries(SYNONYMS).forEach(([term, synonyms]) => {
    if (term.startsWith(normalizedQuery)) {
      synonyms.forEach(synonym => {
        if (!suggestions.includes(synonym)) {
          suggestions.push(synonym);
        }
      });
    }
  });
  
  // Sort by relevance (exact matches first, then by length)
  suggestions.sort((a, b) => {
    // Exact matches first
    if (a.startsWith(normalizedQuery) && !b.startsWith(normalizedQuery)) return -1;
    if (!a.startsWith(normalizedQuery) && b.startsWith(normalizedQuery)) return 1;
    
    // Shorter terms next
    return a.length - b.length;
  });
  
  // Remove duplicates and limit results
  return [...new Set(suggestions)].slice(0, limit);
}

/**
 * Expand a search query with synonyms
 * @param query Original search query
 * @returns Array of terms including the original query and synonyms
 */
export function expandQueryWithSynonyms(query: string): string[] {
  const terms = query.toLowerCase().trim().split(/\s+/);
  const expandedTerms = new Set<string>();
  
  // Add original terms
  terms.forEach(term => expandedTerms.add(term));
  
  // Add synonyms for each term
  terms.forEach(term => {
    if (SYNONYMS[term]) {
      SYNONYMS[term].forEach(synonym => expandedTerms.add(synonym));
    }
  });
  
  return Array.from(expandedTerms);
}

/**
 * Check if a word might be a misspelling and return corrections
 * @param word Potentially misspelled word
 * @returns Array of possible corrections
 */
export function correctMisspelling(word: string): string[] {
  const normalizedWord = word.toLowerCase().trim();
  const corrections: string[] = [];
  
  // Check if the word is a known misspelling
  for (const [correctWord, misspellings] of Object.entries(MISSPELLINGS)) {
    if (misspellings.includes(normalizedWord)) {
      corrections.push(correctWord);
    }
  }
  
  // If no direct matches, use Levenshtein distance for fuzzy matching
  if (corrections.length === 0) {
    const allWords = [
      ...Object.keys(SYNONYMS),
      ...Object.keys(MISSPELLINGS)
    ];
    
    const potentialMatches = allWords
      .filter(correctWord => levenshteinDistance(normalizedWord, correctWord) <= 2)
      .sort((a, b) => 
        levenshteinDistance(normalizedWord, a) - levenshteinDistance(normalizedWord, b)
      );
    
    corrections.push(...potentialMatches.slice(0, 3));
  }
  
  return corrections;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param a First string
 * @param b Second string
 * @returns Distance value (lower means more similar)
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Get spelling suggestions for a query
 * @param query The search query
 * @param limit Maximum number of suggestions to return
 * @returns Array of spelling suggestions
 */
export function getSpellingSuggestions(query: string, limit = 3): string[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const suggestions: string[] = [];
  
  // Check if the query has a misspelling
  const misspellingCheck = processSearchQuery(normalizedQuery);
  if (misspellingCheck.hasMisspellings && Object.keys(misspellingCheck.corrections).length > 0) {
    // Use the processed query as a suggestion
    suggestions.push(misspellingCheck.processedQuery);
  }
  
  // For each word in the query, check for common misspellings
  const words = normalizedQuery.split(/\s+/);
  for (const word of words) {
    // Skip words that are too short
    if (word.length < 3) continue;
    
    // Find words in our dictionary that are similar
    const similarWords = findSimilarWords(word, limit);
    
    // For each similar word, create a suggestion by replacing the original word
    for (const similarWord of similarWords) {
      if (similarWord === word) continue; // Skip exact matches
      
      const newQuery = normalizedQuery.replace(new RegExp(`\\b${word}\\b`, 'g'), similarWord);
      if (newQuery !== normalizedQuery && !suggestions.includes(newQuery)) {
        suggestions.push(newQuery);
        
        // Stop if we've reached the limit
        if (suggestions.length >= limit) break;
      }
    }
    
    // Stop if we've reached the limit
    if (suggestions.length >= limit) break;
  }
  
  return suggestions;
}

/**
 * Find words that are similar to the given word using Levenshtein distance
 * @param word The word to find similar words for
 * @param limit Maximum number of similar words to return
 * @returns Array of similar words
 */
function findSimilarWords(word: string, limit = 3): string[] {
  // In a real application, this would use a dictionary of common words
  // For demonstration, we'll use a small set of common financial terms
  const commonWords = [
    'transfer', 'transaction', 'payment', 'deposit', 'withdrawal',
    'remittance', 'exchange', 'currency', 'balance', 'account',
    'client', 'customer', 'sender', 'receiver', 'beneficiary',
    'amount', 'fee', 'rate', 'document', 'verification',
    'identity', 'passport', 'license', 'receipt', 'invoice',
    'statement', 'report', 'summary', 'history', 'record'
  ];
  
  // Calculate Levenshtein distance for each word
  const wordsWithDistance = commonWords.map(commonWord => ({
    word: commonWord,
    distance: levenshteinDistance(word, commonWord)
  }));
  
  // Sort by distance (closest first) and take the top N
  return wordsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(item => item.word);
}

/**
 * Check if a word is misspelled and return suggestions
 * @param word The word to check for misspellings
 * @returns Array of suggested corrections or empty array if no misspelling
 */
export function checkForMisspelling(word: string): string[] {
  if (!word || word.length < 2) return []; // Reduced minimum length to 2 to catch more typos
  
  // Common financial terms dictionary with possible misspellings
  const dictionary: Record<string, string[]> = {
    'transfer': ['tranfer', 'transfor', 'transfar', 'transfare', 'transfur', 'xfer', 'trnsfer', 'trnsfr'],
    'money': ['monay', 'mony', 'monny', 'moni', 'cash', 'funds'],
    'payment': ['payement', 'payemnt', 'paiment', 'paymet', 'pay', 'paymnt'],
    'exchange': ['exchane', 'exchnage', 'exhange', 'exchenge', 'forex', 'fx'],
    'rate': ['raet', 'reat', 'rte', 'rat', 'rates', 'pricing'],
    'transaction': ['transacton', 'transction', 'transaccion', 'transation', 'tx', 'txn', 'trans'],
    'account': ['acount', 'accont', 'acct', 'acnt', 'acc', 'accts'],
    'balance': ['balence', 'ballance', 'balanse', 'balence', 'bal'],
    'deposit': ['deposite', 'depositt', 'depost', 'dposit', 'dep'],
    'withdraw': ['withdrawl', 'whitdraw', 'withdrow', 'widraw', 'wd', 'wdraw'],
    'client': ['clint', 'cllent', 'cleint', 'clyent', 'clt', 'clnt'],
    'customer': ['custmer', 'cusomer', 'custommer', 'costomer', 'cust', 'custr'],
    'remittance': ['remitance', 'remitence', 'remitanse', 'remitence', 'remit', 'rmt'],
    'currency': ['currancy', 'curency', 'currancy', 'curreny', 'curr', 'ccy'],
    'dashboard': ['dashbord', 'dashbaord', 'dashbrd', 'dasbord', 'dash', 'home'],
    'settings': ['setings', 'settigs', 'settngs', 'settingz', 'config', 'preferences'],
    'profile': ['profil', 'profle', 'proifle', 'profyle', 'prof', 'account'],
    'notification': ['notificaton', 'notifcation', 'notificasion', 'notifiction', 'notif', 'alert'],
    'document': ['documnt', 'docment', 'documant', 'documente', 'doc', 'docs'],
    'verification': ['verifcation', 'verificaton', 'verificasion', 'verifaction', 'verify', 'verif'],
    'identity': ['identty', 'identy', 'identiti', 'idantity', 'id', 'ident'],
    'password': ['pasword', 'passwrd', 'passward', 'passord', 'pwd', 'passwd'],
    'security': ['securty', 'secrity', 'securiti', 'securety', 'sec', 'secure'],
    'authentication': ['autentication', 'authentcation', 'authetication', 'authantication', 'auth', '2fa'],
    'recipient': ['recipent', 'recepient', 'recipiant', 'recepiant', 'recip', 'receiver'],
    'sender': ['sendr', 'sander', 'sendor', 'sendur', 'send', 'from'],
    'beneficiary': ['beneficary', 'benificiary', 'beneficiry', 'benificiary', 'benef', 'bene'],
    'fee': ['fe', 'fea', 'fie', 'fei', 'charge', 'cost'],
    'commission': ['comission', 'comision', 'commision', 'commisson', 'comm', 'cmsn'],
    'history': ['histori', 'histry', 'histary', 'hystory', 'hist', 'past'],
    'statement': ['statment', 'statament', 'statemant', 'statment', 'stmt', 'report'],
    'report': ['reprt', 'repotr', 'reprot', 'reoprt', 'rpt', 'reporting'],
    'compliance': ['complience', 'complianse', 'complience', 'complians', 'compl', 'regulatory'],
    'regulation': ['regulaton', 'regulasion', 'regulaton', 'regilation', 'reg', 'rule'],
    'send': ['snd', 'sned', 'sende', 'sent', 'sending'],
    'receive': ['recieve', 'receve', 'recive', 'reciev', 'rcv', 'get'],
    'help': ['halp', 'hlp', 'hellp', 'assistance', 'support', 'guide'],
    'support': ['suport', 'suprt', 'supprt', 'supp', 'help', 'assist'],
    'search': ['serch', 'srch', 'sarch', 'sreach', 'find', 'lookup'],
    'status': ['staus', 'statuss', 'statu', 'state', 'condition'],
    'pending': ['pendng', 'pnding', 'pendin', 'waiting', 'processing'],
    'completed': ['completd', 'complted', 'compltd', 'done', 'finished'],
    'failed': ['faild', 'faled', 'failld', 'error', 'rejected'],
    'approve': ['aprove', 'approv', 'aprv', 'accept', 'confirm'],
    'reject': ['rejct', 'rejectt', 'rjct', 'deny', 'decline'],
    'login': ['logn', 'loign', 'signin', 'sign in', 'access'],
    'logout': ['logot', 'logut', 'signout', 'sign out', 'exit'],
  };
  
  // Synonym mappings for alternative terms
  const synonyms: Record<string, string[]> = {
    'send': ['transfer', 'remit', 'transmit', 'wire', 'dispatch'],
    'money': ['cash', 'funds', 'currency', 'payment', 'finance'],
    'client': ['customer', 'user', 'member', 'patron', 'account holder'],
    'transaction': ['transfer', 'payment', 'operation', 'deal', 'exchange'],
    'dashboard': ['home', 'main', 'overview', 'summary', 'control panel'],
    'settings': ['preferences', 'options', 'configuration', 'setup', 'customize'],
    'profile': ['account', 'user', 'details', 'information', 'bio'],
    'search': ['find', 'lookup', 'query', 'browse', 'locate'],
    'help': ['support', 'assistance', 'guide', 'aid', 'faq'],
    'exchange': ['convert', 'swap', 'trade', 'forex', 'fx'],
    'rate': ['price', 'cost', 'value', 'quote', 'charge'],
    'status': ['state', 'condition', 'progress', 'standing', 'situation'],
    'document': ['file', 'record', 'paper', 'form', 'certificate'],
    'notification': ['alert', 'message', 'notice', 'update', 'reminder'],
    'security': ['protection', 'safety', 'defense', 'safeguard', 'shield'],
  };
  
  // Normalize the word
  const normalizedWord = word.toLowerCase().trim();
  
  // Check if the word is a misspelling of a known term
  for (const [correctWord, misspellings] of Object.entries(dictionary)) {
    if (misspellings.includes(normalizedWord)) {
      return [correctWord];
    }
  }
  
  // Check if the word is already correct
  if (Object.keys(dictionary).includes(normalizedWord)) {
    // If the word is correct, also return synonyms
    const wordSynonyms = synonyms[normalizedWord] || [];
    return wordSynonyms.length > 0 ? [normalizedWord, ...wordSynonyms] : [];
  }
  
  // Check if the word is a synonym of a known term
  for (const [mainTerm, termSynonyms] of Object.entries(synonyms)) {
    if (termSynonyms.includes(normalizedWord)) {
      return [mainTerm, ...termSynonyms.filter(s => s !== normalizedWord)];
    }
  }
  
  // Calculate Levenshtein distance to find similar words
  const suggestions: string[] = [];
  const distanceMap: Record<string, number> = {};
  
  // Check against dictionary words
  for (const correctWord of Object.keys(dictionary)) {
    const distance = levenshteinDistance(normalizedWord, correctWord);
    
    // If the distance is small enough, consider it a potential correction
    // Threshold is proportional to word length but more forgiving for short words
    const threshold = Math.max(2, Math.floor(correctWord.length * 0.35));
    
    if (distance <= threshold) {
      suggestions.push(correctWord);
      distanceMap[correctWord] = distance;
    }
  }
  
  // Also check against all synonyms
  for (const [mainTerm, termSynonyms] of Object.entries(synonyms)) {
    for (const synonym of termSynonyms) {
      if (!suggestions.includes(synonym)) {
        const distance = levenshteinDistance(normalizedWord, synonym);
        const threshold = Math.max(2, Math.floor(synonym.length * 0.35));
        
        if (distance <= threshold) {
          suggestions.push(synonym);
          distanceMap[synonym] = distance;
          
          // Also add the main term if not already included
          if (!suggestions.includes(mainTerm)) {
            suggestions.push(mainTerm);
            distanceMap[mainTerm] = distance + 0.5; // Slightly lower priority
          }
        }
      }
    }
  }
  
  // Sort suggestions by Levenshtein distance (closest first)
  return suggestions.sort((a, b) => (distanceMap[a] || 999) - (distanceMap[b] || 999));
}

/**
 * Process a search query to handle misspellings and expand with synonyms
 * @param query Original search query
 * @returns Processed query with corrections and expansions
 */
export function processSearchQuery(query: string): {
  originalQuery: string;
  processedQuery: string;
  expandedTerms: string[];
  corrections: Record<string, string>;
  hasMisspellings: boolean;
  suggestions: string[];
} {
  const originalQuery = query.trim();
  const terms = originalQuery.toLowerCase().split(/\s+/);
  const corrections: Record<string, string> = {};
  let hasMisspellings = false;
  let allSuggestions: string[] = [];
  
  // Check for misspellings and collect suggestions
  const correctedTerms = terms.map(term => {
    // Use our enhanced checkForMisspelling function that returns suggestions
    const suggestions = checkForMisspelling(term);
    
    // Add unique suggestions to our collection
    suggestions.forEach(suggestion => {
      if (!allSuggestions.includes(suggestion)) {
        allSuggestions.push(suggestion);
      }
    });
    
    // If we have suggestions and the first one is different from the term,
    // consider it a correction
    if (suggestions.length > 0 && suggestions[0] !== term) {
      corrections[term] = suggestions[0];
      hasMisspellings = true;
      return suggestions[0];
    }
    
    return term;
  });
  
  const processedQuery = correctedTerms.join(' ');
  
  // Get additional synonyms for the processed query
  const expandedTerms = expandQueryWithSynonyms(processedQuery);
  
  // Add unique expanded terms to suggestions
  expandedTerms.forEach(term => {
    if (!allSuggestions.includes(term) && term !== processedQuery) {
      allSuggestions.push(term);
    }
  });
  
  // Sort suggestions by length (shorter first) for better UX
  allSuggestions.sort((a, b) => a.length - b.length);
  
  return {
    originalQuery,
    processedQuery,
    expandedTerms,
    corrections,
    hasMisspellings,
    suggestions: allSuggestions
  };
}
