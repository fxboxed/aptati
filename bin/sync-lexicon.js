/**
 * =========================================================================
 * MULTI-FILE DIRECTORY RECOVERY ENGINE (bin/sync-lexicon.js)
 * =========================================================================
 */
import 'dotenv/config';
import { google } from 'googleapis';
import mongoose from 'mongoose';
import WordStack from '../models/WordStack.js';

async function syncDynamicFilesToMongo() {
  console.log('🔄 Initializing Multi-File Directory Lexicon Synchronizer...');

  // 1. Establish Secure Database Connection
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aptati');
      console.log('🍃 Local MongoDB Connected Successfully.');
    }
  } catch (err) {
    console.error('❌ Critical Database Connection Failure:', err);
    process.exit(1);
  }

  try {
    // 2. Authenticate with Google API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // This is the file ID of your "Aptati_Directory_Master" sheet
    const directorySpreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 3. PHASE 1: Scan the central directory file to find all active spreadsheet links
    console.log('📡 Scanning Master Directory Spreadsheet for file allocations...');
    
    // Fallback Range: Drops strict name matching to grab columns A & B from the initial sheet view
    const directoryResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: directorySpreadsheetId,
      range: 'A2:B', 
    });

    const directoryRows = directoryResponse.data.values;
    if (!directoryRows || directoryRows.length === 0) {
      console.error('🛑 Master Directory sheet is empty or unreadable! Process halted.');
      process.exit(1);
    }

    console.log(`📦 Found ${directoryRows.length} active category files listed in directory.`);

    const bulkOps = [];
    let grandTotalRows = 0;
    let totalSkippedWords = 0;

    // 4. PHASE 2: Loop through each isolated spreadsheet file found in the matrix
    for (const fileRow of directoryRows) {
      const categoryName = fileRow[0] ? fileRow[0].trim() : 'Unknown';
      const targetSpreadsheetId = fileRow[1] ? fileRow[1].trim() : '';

      if (!targetSpreadsheetId) {
        console.warn(`⚠️ Category [${categoryName}] has a missing Spreadsheet ID token. Skipping.`);
        continue;
      }

      // Explicitly construct the targeted raw layout data tab (e.g. "Lexicon_Source_Birds")
      const targetTabName = `Lexicon_Source_${categoryName}`;
      console.log(`📖 Syncing: [ ${categoryName} ] ➔ Querying Target Tab: "${targetTabName}"`);

      try {
        // Grab from Column A down through Column R (Indices 0 to 17) to process game flags safely
        const range = `${targetTabName}!A2:R`; 
        
        const fileResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: targetSpreadsheetId,
          range: range
        });

        const wordRows = fileResponse.data.values;
        if (!wordRows || wordRows.length === 0) {
          console.log(`   ↳ ℹ️ Spreadsheet file tab "${targetTabName}" is empty.`);
          continue;
        }

        grandTotalRows += wordRows.length;

        for (const row of wordRows) {
          const rawWord = row[0] ? row[0].toUpperCase().trim() : ''; // Column A (word)
          
          // Skip empty row spaces
          if (!rawWord) continue;

          // Read calculated metrics directly from Column B (letters)
          const calculatedLength = row[1] ? parseInt(row[1], 10) : rawWord.length;

          // Game Flags: Strict structural mapping based on verified EAGLE diagnostic row array
          const isWS = row[14] ? String(row[14]).toLowerCase().trim() === 'y' : false; // Index 14 (ws)
          const isSB = row[15] ? String(row[15]).toLowerCase().trim() === 'y' : false; // Index 15 (sb)
          const isCQ = row[16] ? String(row[16]).toLowerCase().trim() === 'y' : false; // Index 16 (cq)
          const isLL = row[17] ? String(row[17]).toLowerCase().trim() === 'y' : false; // Index 17 (ll)

          // STRICT CONSTRAINTS VALIDATION: Word Stack targets must be exactly 5 letters long
          let verifiedWSFlag = isWS;
          if (isWS && calculatedLength !== 5) {
            console.warn(`   ↳ ⚠️ Validation Drop: "${rawWord}" in [${categoryName}] marked 'ws' but length is ${calculatedLength}. flag forced to false.`);
            verifiedWSFlag = false;
          }

          // Don't waste DB memory cache space if no free game allocations are tagged true
          if (!verifiedWSFlag && !isSB && !isCQ && !isLL) {
            totalSkippedWords++;
            continue;
          }

          // Map properties cleanly to matching subdocument indices
          bulkOps.push({
            updateOne: {
              filter: { word: rawWord },
              update: {
                $set: {
                  word: rawWord,
                  length: calculatedLength,
                  category: categoryName.toLowerCase(),
                  'flags.ws': verifiedWSFlag,
                  'flags.sb': isSB,
                  'flags.cq': isCQ,
                  'flags.ll': isLL
                }
              },
              upsert: true
            }
          });
        }

      } catch (fileError) {
        console.error(`❌ Connection Failure parsing targeted tab structural layout on category [${categoryName}].`);
        console.error(`   Verify sheet tab name is exactly "${targetTabName}" and account permission values are set.`);
        continue;
      }
    }

    // 5. TRANSACTION Execution Phase
    if (bulkOps.length > 0) {
      console.log(`💾 Transmitting batch cache arrays for ${bulkOps.length} elements to MongoDB...`);
      const result = await WordStack.bulkWrite(bulkOps, { ordered: false });
      
      console.log('\n======================================================');
      console.log('📊 DISTRIBUTED MASTER RECOVERY SYNC COMPLETE');
      console.log('======================================================');
      console.log(`🔹 Total Spreadsheet Files Checked: ${directoryRows.length}`);
      console.log(`🔹 Raw Rows Evaluated in Cloud:    ${grandTotalRows}`);
      console.log(`🔹 DB Collection Documents Synced:  ${result.upsertedCount + result.modifiedCount}`);
      console.log(`🔹 Non-game Data Entries Skipped:  ${totalSkippedWords}`);
      console.log('======================================================\n');
    } else {
      console.log('ℹ️ Sync completed. Clean workbook data matched local database precisely.');
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Critical Directory Pipeline Sync Engine Failure:', error);
    process.exit(1);
  }
}

syncDynamicFilesToMongo();