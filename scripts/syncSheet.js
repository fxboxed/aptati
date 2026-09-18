import WordStack from '../models/WordStack.js';

const GOOGLE_SHEET_CSV_URL = process.env.GOOGLE_SHEET_CSV_URL;

export const syncGoogleSheet = async () => {
    try {
        console.log('🔄 Fetching Google Sheet CSV...');

        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();

        const rows = csvText.split('\n').map(row => row.split(','));
        const bulkOps = [];

        for (const row of rows) {
            if (row.length >= 2) {
                const word = row[0].trim().toUpperCase();
                const classification = row[1].trim().toUpperCase();

                if (word === 'WORD' || !['TARGET', 'ALLOWED'].includes(classification)) continue;

                bulkOps.push({
                    updateOne: {
                        filter: { word: word },
                        update: { 
                            $set: { 
                                word: word, 
                                classification: classification
                            } 
                        },
                        upsert: true
                    }
                });
            }
        }

        if (bulkOps.length > 0) {
            const result = await WordStack.bulkWrite(bulkOps);
            console.log(`✅ Sync Complete: ${result.upsertedCount} added | ${result.modifiedCount} updated.`);
        } else {
            console.log('⚠️ No valid records found in Google Sheet.');
        }

    } catch (error) {
        console.error(`❌ Sync Failed: ${error.message}`);
    }
};