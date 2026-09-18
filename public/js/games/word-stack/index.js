/**
 * =========================================================================
 * WORD STACK (`ws`) SELF-CONTAINED GAME ENGINE WITH PERSISTENCE
 * LOCATION: public/js/games/word-stack/index.js
 * =========================================================================
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. ENGINE CORE CONFIGURATION & STATE
  // -------------------------------------------------------------------------
  const CONFIG = {
    WORD_LENGTH: 5,
    MAX_ATTEMPTS: 6,
    MESSAGE_DURATION: 3000,
    STORAGE_KEY: 'word_stack_game_state' // Key for localStorage
  };

  let gameState = {
    targetWord: '',
    currentAttempt: 0,
    currentTile: 0,
    isGameOver: false,
    boardMatrix: []
  };

  // -------------------------------------------------------------------------
  // 2. DOM ELEMENT REGISTRY
  // -------------------------------------------------------------------------
  const DOM = {
    restartBtn: document.getElementById('ws-restart-btn'),
    answersBtn: document.getElementById('ws-open-answers-dropdown-btn'),
    answersDropdown: document.getElementById('ws-answers-dropdown'),
    shuffleBtn: document.getElementById('ws-shuffle-btn'),
    clearBtn: document.getElementById('ws-clear-btn'),
    submitBtn: document.getElementById('ws-submit-btn'),
    gridContainer: document.getElementById('ws-word-grid'),
    keyboardContainer: document.getElementById('ws-keyboard'),
    messageDisplay: document.getElementById('ws-message-display')
  };

  const getTileEl = (row, col) => {
    return document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
  };

  // -------------------------------------------------------------------------
  // 3. STORAGE PERSISTENCE HELPERS
  // -------------------------------------------------------------------------

  /**
   * Saves active state matrix into localStorage
   */
  function saveGameState() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(gameState));
    } catch (err) {
      console.warn('Unable to write game state to localStorage:', err);
    }
  }

  /**
   * Clears saved state from localStorage (used on restart/shuffle)
   */
  function clearGameState() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (err) {
      console.warn('Unable to clear localStorage:', err);
    }
  }

  // -------------------------------------------------------------------------
  // 4. UI ANIMATION & MESSAGE DISPLAY LAYER
  // -------------------------------------------------------------------------
  let messageTimeout = null;

  function showGameMessage(text) {
    if (!DOM.messageDisplay) return;

    if (messageTimeout) clearTimeout(messageTimeout);

    DOM.messageDisplay.textContent = text;
    DOM.messageDisplay.classList.add('active-state');
    
    const footerBtnsContainer = DOM.shuffleBtn?.parentElement;
    if (footerBtnsContainer) {
      footerBtnsContainer.classList.add('hidden-state');
    }

    messageTimeout = setTimeout(() => {
      DOM.messageDisplay.classList.remove('active-state');
      if (footerBtnsContainer) {
        footerBtnsContainer.classList.remove('hidden-state');
      }
    }, CONFIG.MESSAGE_DURATION);
  }

  // -------------------------------------------------------------------------
  // 5. GAME LOGIC & SMART POINTERS
  // -------------------------------------------------------------------------
  
  function advanceToNextOpenTile() {
    const row = gameState.currentAttempt;
    if (row >= CONFIG.MAX_ATTEMPTS) return;

    while (gameState.currentTile < CONFIG.WORD_LENGTH) {
      const currentVal = gameState.boardMatrix[row][gameState.currentTile];
      if (currentVal === '' || currentVal === undefined || currentVal === null) {
        break;
      }
      gameState.currentTile++;
    }
  }

  function retreatToPreviousOpenTile() {
    const row = gameState.currentAttempt;
    let prevTile = gameState.currentTile - 1;

    while (prevTile >= 0) {
      const tileEl = getTileEl(row, prevTile);
      if (tileEl && !tileEl.classList.contains('ws-carried')) {
        gameState.currentTile = prevTile;
        return true;
      }
      prevTile--;
    }
    return false; 
  }

  /**
   * Reconstructs UI grid and keys from a restored state object
   */
  function restoreUIFromState() {
    // 1. Re-evaluate and color previous attempts
    for (let row = 0; row < gameState.currentAttempt; row++) {
      const guessArray = gameState.boardMatrix[row];
      const targetArray = gameState.targetWord.split('');
      const rowTileStatuses = Array(CONFIG.WORD_LENGTH).fill('ws-incorrect');
      
      const targetLetterCount = {};
      targetArray.forEach(char => {
        targetLetterCount[char] = (targetLetterCount[char] || 0) + 1;
      });

      // Pass 1: Green
      guessArray.forEach((char, idx) => {
        if (char === targetArray[idx]) {
          rowTileStatuses[idx] = 'ws-correct';
          targetLetterCount[char]--;
        }
      });

      // Pass 2: Yellow
      guessArray.forEach((char, idx) => {
        if (rowTileStatuses[idx] !== 'ws-correct' && targetLetterCount[char] > 0) {
          rowTileStatuses[idx] = 'ws-present';
          targetLetterCount[char]--;
        }
      });

      // Apply row styles & keyboard highlights
      guessArray.forEach((char, idx) => {
        const tileEl = getTileEl(row, idx);
        if (tileEl) {
          tileEl.textContent = char;
          tileEl.classList.add(rowTileStatuses[idx]);
        }

        const virtualKeyEl = document.querySelector(`.key[data-key="${char}"]`);
        if (virtualKeyEl) {
          const statusClass = rowTileStatuses[idx];
          if (!virtualKeyEl.classList.contains('ws-correct')) {
            if (statusClass === 'ws-correct') {
              virtualKeyEl.classList.remove('ws-present', 'ws-incorrect');
              virtualKeyEl.classList.add('ws-correct');
            } else if (statusClass === 'ws-present' && !virtualKeyEl.classList.contains('ws-present')) {
              virtualKeyEl.classList.remove('ws-incorrect');
              virtualKeyEl.classList.add('ws-present');
            } else if (statusClass === 'ws-incorrect' && !virtualKeyEl.classList.contains('ws-present')) {
              virtualKeyEl.classList.add('ws-incorrect');
            }
          }
        }
      });
    }

    // 2. Fill current (in-progress) row values & mark carried green tiles
    const activeRow = gameState.currentAttempt;
    if (activeRow < CONFIG.MAX_ATTEMPTS) {
      for (let col = 0; col < CONFIG.WORD_LENGTH; col++) {
        const char = gameState.boardMatrix[activeRow][col];
        const tileEl = getTileEl(activeRow, col);
        
        if (char && tileEl) {
          tileEl.textContent = char;
          // Check if this was a carried green from previous row
          if (activeRow > 0 && gameState.boardMatrix[activeRow - 1][col] === char && gameState.targetWord[col] === char) {
            tileEl.classList.add('ws-correct', 'ws-carried');
          }
        }
      }
    }

    if (DOM.answersDropdown) {
      DOM.answersDropdown.innerHTML = `<span class="answer-reveal">Target Word: <strong>${gameState.targetWord}</strong></span>`;
    }

    advanceToNextOpenTile();
  }

  /**
   * Initializes state: reads from localStorage if present, otherwise calls API.
   */
  async function initializeGameUniverse(forceNewGame = false) {
    if (forceNewGame) {
      clearGameState();
    } else {
      const savedRaw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (savedRaw) {
        try {
          const parsedState = JSON.parse(savedRaw);
          if (parsedState && parsedState.targetWord && Array.isArray(parsedState.boardMatrix)) {
            gameState = parsedState;
            restoreUIFromState();
            return;
          }
        } catch (e) {
          console.error('Failed parsing saved localStorage state:', e);
          clearGameState();
        }
      }
    }

    // Fallback/Fresh load via API
    try {
      const response = await fetch('/api/games/ws');
      if (!response.ok) throw new Error('Network response failure');
      
      const responseData = await response.json();
      const rawWord = responseData.data ? responseData.data.word : responseData.word;
      
      if (!rawWord) throw new Error('Word field missing from server payload.');
      
      gameState.targetWord = rawWord.toUpperCase();
      
    } catch (error) {
      console.error('❌ API fetch error. Fallback engaged:', error);
      gameState.targetWord = 'FINCH'; 
    }

    gameState.currentAttempt = 0;
    gameState.currentTile = 0;
    gameState.isGameOver = false;
    gameState.boardMatrix = Array.from({ length: CONFIG.MAX_ATTEMPTS }, () => 
      Array(CONFIG.WORD_LENGTH).fill('')
    );

    document.querySelectorAll('.tile').forEach(tile => {
      tile.textContent = '';
      tile.className = 'tile'; 
    });

    document.querySelectorAll('.key').forEach(key => {
      key.classList.remove('ws-correct', 'ws-present', 'ws-incorrect');
    });

    if (DOM.answersDropdown) {
      DOM.answersDropdown.innerHTML = `<span class="answer-reveal">Target Word: <strong>${gameState.targetWord}</strong></span>`;
    }
    
    saveGameState();
    advanceToNextOpenTile();
  }

  function handleLetterInput(letter) {
    if (gameState.isGameOver || gameState.currentTile >= CONFIG.WORD_LENGTH) return;

    const row = gameState.currentAttempt;
    const col = gameState.currentTile;

    gameState.boardMatrix[row][col] = letter;
    const tileEl = getTileEl(row, col);
    if (tileEl) {
      tileEl.textContent = letter;
      tileEl.classList.add('tile-pop');
    }

    gameState.currentTile++;
    advanceToNextOpenTile();
    saveGameState();
  }

  function handleBackspace() {
    if (gameState.isGameOver) return;

    const canRetreat = retreatToPreviousOpenTile();
    if (!canRetreat) return; 

    const row = gameState.currentAttempt;
    const col = gameState.currentTile;

    gameState.boardMatrix[row][col] = '';
    const tileEl = getTileEl(row, col);
    if (tileEl) {
      tileEl.textContent = '';
      tileEl.classList.remove('tile-pop');
    }

    saveGameState();
  }

  function submitGuess() {
    if (gameState.isGameOver) return;

    const row = gameState.currentAttempt;

    for (let col = 0; col < CONFIG.WORD_LENGTH; col++) {
      const tileEl = getTileEl(row, col);
      if (tileEl && tileEl.textContent) {
        gameState.boardMatrix[row][col] = tileEl.textContent.trim().toUpperCase();
      }
    }

    const currentGuess = gameState.boardMatrix[row].join('');
    
    if (currentGuess.length < CONFIG.WORD_LENGTH) {
      showGameMessage('NOT ENOUGH LETTERS');
      return;
    }

    const targetArray = gameState.targetWord.split('');
    const guessArray = currentGuess.split('');
    const rowTileStatuses = Array(CONFIG.WORD_LENGTH).fill('ws-incorrect');

    const targetLetterCount = {};
    targetArray.forEach(char => {
      targetLetterCount[char] = (targetLetterCount[char] || 0) + 1;
    });

    // Pass 1: Green
    guessArray.forEach((char, idx) => {
      if (char === targetArray[idx]) {
        rowTileStatuses[idx] = 'ws-correct';
        targetLetterCount[char]--;
      }
    });

    // Pass 2: Yellow
    guessArray.forEach((char, idx) => {
      if (rowTileStatuses[idx] !== 'ws-correct') {
        if (targetLetterCount[char] && targetLetterCount[char] > 0) {
          rowTileStatuses[idx] = 'ws-present';
          targetLetterCount[char]--;
        }
      }
    });

    // Apply styles
    guessArray.forEach((char, idx) => {
      const tileEl = getTileEl(row, idx);
      const statusClass = rowTileStatuses[idx];
      
      if (tileEl) {
        tileEl.classList.remove('ws-correct', 'ws-present', 'ws-incorrect');
        tileEl.classList.add(statusClass);
      }

      const virtualKeyEl = document.querySelector(`.key[data-key="${char}"]`);
      if (virtualKeyEl) {
        if (!virtualKeyEl.classList.contains('ws-correct')) {
          if (statusClass === 'ws-correct') {
            virtualKeyEl.classList.remove('ws-present', 'ws-incorrect');
            virtualKeyEl.classList.add('ws-correct');
          } else if (statusClass === 'ws-present' && !virtualKeyEl.classList.contains('ws-present')) {
            virtualKeyEl.classList.remove('ws-incorrect');
            virtualKeyEl.classList.add('ws-present');
          } else if (statusClass === 'ws-incorrect' && !virtualKeyEl.classList.contains('ws-present')) {
            virtualKeyEl.classList.add('ws-incorrect');
          }
        }
      }
    });

    // Win check
    if (currentGuess === gameState.targetWord) {
      showGameMessage('BRILLIANT CONGRATULATIONS!');
      gameState.isGameOver = true;
      saveGameState();
      return;
    }

    gameState.currentAttempt++;
    
    // Loss check
    if (gameState.currentAttempt >= CONFIG.MAX_ATTEMPTS) {
      showGameMessage(`GAME OVER! ANSWER: ${gameState.targetWord}`);
      gameState.isGameOver = true;
      saveGameState();
      return;
    }

    // Auto-carry green tiles into next row
    const nextRow = gameState.currentAttempt;
    rowTileStatuses.forEach((status, idx) => {
      if (status === 'ws-correct') {
        const correctLetter = targetArray[idx];
        gameState.boardMatrix[nextRow][idx] = correctLetter;
        
        const nextTileEl = getTileEl(nextRow, idx);
        if (nextTileEl) {
          nextTileEl.textContent = correctLetter;
          nextTileEl.classList.add('ws-correct', 'ws-carried'); 
        }
      }
    });

    gameState.currentTile = 0;
    advanceToNextOpenTile();
    saveGameState();
  }

  // -------------------------------------------------------------------------
  // 6. EVENT LISTENERS SETUP
  // -------------------------------------------------------------------------
  function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleLetterInput(e.key.toUpperCase());
      }
    });

    DOM.keyboardContainer?.addEventListener('click', (e) => {
      const targetKey = e.target.closest('.key');
      if (!targetKey) return;

      const action = targetKey.getAttribute('data-action');
      const keyValue = targetKey.getAttribute('data-key');

      if (action === 'enter') submitGuess();
      else if (action === 'backspace') handleBackspace();
      else if (keyValue) handleLetterInput(keyValue.toUpperCase());
    });

    DOM.submitBtn?.addEventListener('click', submitGuess);
    DOM.clearBtn?.addEventListener('click', () => {
      while (gameState.currentTile > 0) {
        handleBackspace();
      }
    });
    
    // Force new game on explicit user action
    DOM.shuffleBtn?.addEventListener('click', async () => {
      await initializeGameUniverse(true);
      showGameMessage('SHUFFLED NEW TARGET WORD');
    });

    DOM.restartBtn?.addEventListener('click', async () => {
      await initializeGameUniverse(true); 
      showGameMessage('GAME RESTARTED');
    });

    DOM.answersBtn?.addEventListener('blur', () => {
      setTimeout(async () => {
        await initializeGameUniverse(true);
      }, 350);
    });
  }

  initializeGameUniverse().then(() => {
    setupEventListeners();
  });

})();