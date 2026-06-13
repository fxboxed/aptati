/**
 * =========================================================================
 * WORD STACK (`ws`) SELF-CONTAINED ENGINE
 * LOCATION: public/js/games/word-stack/index.js
 * =========================================================================
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. ENGINE CORE STATE MATRIX
  // -------------------------------------------------------------------------
  const CONFIG = {
    WORD_LENGTH: 5,
    MAX_ATTEMPTS: 6,
    MESSAGE_DURATION: 3000
  };

  let gameState = {
    targetWord: '',
    currentAttempt: 0,
    currentTile: 0,
    isGameOver: false,
    boardMatrix: [] // Holds a 2D grid representation of letters strings
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

  // Helper utility to safely grab specific grid block row/col coordinate elements
  const getTileEl = (row, col) => {
    return document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
  };

  // -------------------------------------------------------------------------
  // 3. UI ANIMATION & MESSAGE TOGGLE LAYER
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
  // 4. BUSINESS LOGIC & VALIDATION ENGINE (WITH AUTO-CARRY & SMART POINTER)
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
   * Fetches an entirely unpredicted, randomized 5-letter bird target word 
   * from MongoDB via the backend server route allocation pool.
   */
  async function initializeGameUniverse() {
    try {
      const response = await fetch('/api/games/word-stack/random');
      if (!response.ok) throw new Error('Network database synchronization response issue.');
      
      const data = await response.json();
      gameState.targetWord = data.word.toUpperCase();
      
    } catch (error) {
      console.error('❌ Failed fetching word stream from MongoDB pipeline fallback triggered:', error);
      // Absolute final hardware failure string protection if MongoDB goes down completely
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
      DOM.answersDropdown.innerHTML = `<span class="answer-reveal">Target Bird: **${gameState.targetWord}**</span>`;
    }
    
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
  }

  function submitGuess() {
    if (gameState.isGameOver) return;

    const row = gameState.currentAttempt;
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

    guessArray.forEach((char, idx) => {
      if (char === targetArray[idx]) {
        rowTileStatuses[idx] = 'ws-correct';
        targetLetterCount[char]--;
      }
    });

    guessArray.forEach((char, idx) => {
      if (rowTileStatuses[idx] !== 'ws-correct') {
        if (targetLetterCount[char] > 0) {
          rowTileStatuses[idx] = 'ws-present';
          targetLetterCount[char]--;
        }
      }
    });

    guessArray.forEach((char, idx) => {
      const tileEl = getTileEl(row, idx);
      const statusClass = rowTileStatuses[idx];
      
      if (tileEl) {
        tileEl.classList.add(statusClass);
      }

      const virtualKeyEl = document.querySelector(`.key[data-key="${char}"]`);
      if (virtualKeyEl) {
        if (!virtualKeyEl.classList.contains('ws-correct')) {
          virtualKeyEl.classList.remove('ws-present', 'ws-incorrect');
          virtualKeyEl.classList.add(statusClass);
        }
      }
    });

    if (currentGuess === gameState.targetWord) {
      showGameMessage('BRILLIANT CONGRATULATIONS!');
      gameState.isGameOver = true;
      return;
    }

    gameState.currentAttempt++;
    
    if (gameState.currentAttempt >= CONFIG.MAX_ATTEMPTS) {
      showGameMessage(`GAME OVER! ANSWER: ${gameState.targetWord}`);
      gameState.isGameOver = true;
      return;
    }

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
  }

  // -------------------------------------------------------------------------
  // 5. INPUT EVENT INTERCEPTION SYSTEMS
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
    DOM.shuffleBtn?.addEventListener('click', async () => {
      await initializeGameUniverse();
      showGameMessage('SHUFFLED NEW DATABASE TARGET BIRD');
    });

    DOM.restartBtn?.addEventListener('click', async () => {
      await initializeGameUniverse(); 
      showGameMessage('GAME RESTARTED');
    });

    DOM.answersBtn?.addEventListener('blur', () => {
      setTimeout(async () => {
        await initializeGameUniverse();
      }, 350);
    });
  }

  // Self-executing anchor cycle initialization
  initializeGameUniverse().then(() => {
    setupEventListeners();
  });

})();