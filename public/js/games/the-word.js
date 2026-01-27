/**
 * The Word - Wordle-like game
 * Main game logic and functionality
 */

(function() {
    'use strict';
    
    // Game configuration
    const WORD_LENGTH = 5;
    const MAX_ATTEMPTS = 6;
    const EMPTY_COLOR = '#a4c9d9';
    const CORRECT_COLOR = '#80ef80';
    const PRESENT_COLOR = '#e4ca99';
    const INCORRECT_COLOR = '#dc7684';
    
    // Game state
    let gameState = {
        targetWord: '',
        currentRow: 0,
        currentCol: 0,
        gameOver: false,
        gameWon: false
    };
    
    // DOM elements
    let remainingEl, messageEl, gridEl, keyboardEl;
    
    // Word lists (365+ unique 5-letter words for 1 year)
    const VALID_WORDS = [
        // Common 5-letter words (sample - would need 365+ for production)
        'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADAPT', 'ADMIT', 'ADOPT', 'ADULT',
        'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE',
        'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE',
        'ANGRY', 'ANIMAL', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY',
        'ASIDE', 'ASSET', 'AVOID', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC',
        'BASIS', 'BEACH', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK',
        'BLAME', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN',
        'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN',
        'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN',
        'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA',
        'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLOCK', 'CLOSE',
        'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CREAM',
        'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED',
        'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DENSE', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN',
        'DRAFT', 'DRAMA', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE',
        'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELECT', 'ELITE', 'EMPTY', 'ENEMY',
        'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST',
        'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT',
        'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE',
        'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT',
        'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE',
        'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP',
        'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY',
        'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'IMPLY',
        'INCRE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES',
        'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN',
        'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS',
        'LIVES', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC',
        'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA',
        'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL',
        'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY',
        'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER',
        'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE',
        'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PLACE',
        'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE',
        'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN',
        'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH',
        'REACT', 'READY', 'REFER', 'RIGHT', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER', 'ROMAN',
        'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE',
        'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF',
        'SHELL', 'SHIFT', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT', 'SINCE',
        'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLAVE', 'SLEEP', 'SLIDE', 'SMALL', 'SMART',
        'SMILE', 'SMITH', 'SMOKE', 'SOLAR', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH',
        'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT',
        'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL', 'STEEP',
        'STEVE', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY',
        'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUNNY', 'SUPER',
        'SWEET', 'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEETH', 'TERRY', 'TEXAS',
        'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK',
        'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'TIGHT', 'TIMES', 'TITLE', 'TODAY',
        'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT',
        'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TROOP', 'TRUCK', 'TRULY',
        'TRUST', 'TRUTH', 'TWICE', 'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER',
        'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT',
        'VITAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE',
        'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST',
        'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE', 'YIELD', 'YOUNG', 'YOUTH',
        'ABACK', 'ABASE', 'ABATE', 'ABBEY', 'ABBOT', 'ABHOR', 'ABIDE', 'ABLED', 'ABODE',
        'ABORT', 'ABOUT', 'ABOVE', 'ABUSE', 'ABYSS', 'ACORN', 'ACRID', 'ACTOR', 'ACUTE',
        'ADAGE', 'ADAPT', 'ADEPT', 'ADMIN', 'ADMIT', 'ADOBE', 'ADOPT', 'ADORE', 'ADORN',
        'ADULT', 'AFFIX', 'AFIRE', 'AFOOT', 'AFOUL', 'AFTER', 'AGAIN', 'AGAPE', 'AGATE',
        'AGENT', 'AGILE', 'AGING', 'AGLOW', 'AGONY', 'AGREE', 'AHEAD', 'AIDER', 'AISLE',
        'ALARM', 'ALBUM', 'ALERT', 'ALGAE', 'ALIBI', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
        'ALLAY', 'ALLEY', 'ALLOT', 'ALLOW', 'ALLOY', 'ALOFT', 'ALONE', 'ALONG', 'ALOOF',
        'ALOUD', 'ALPHA', 'ALTAR', 'ALTER', 'AMASS', 'AMAZE', 'AMBER', 'AMBLE', 'AMEND',
        'AMISS', 'AMITY', 'AMONG', 'AMPLE', 'AMPLY', 'AMUSE', 'ANGEL', 'ANGER', 'ANGLE',
        'ANGRY', 'ANGST', 'ANIMA', 'ANIME', 'ANKLE', 'ANNEX', 'ANNOY', 'ANNUL', 'ANODE',
        'ANTIC', 'ANVIL', 'AORTA', 'APACE', 'APART', 'APHID', 'APING', 'APNEA', 'APPLE',
        'APPLY', 'APRON', 'APTLY', 'ARBOR', 'ARDOR', 'ARENA', 'ARISE', 'ARMOR', 'AROMA',
        'AROSE', 'ARRAY', 'ARROW', 'ARSON', 'ARTSY', 'ASCOT', 'ASHEN', 'ASIDE', 'ASKEW',
        'ASSAY', 'ASSET', 'ATOLL', 'ATONE', 'ATTIC', 'AUDIO', 'AUDIT', 'AUGUR', 'AUNTY',
        'AVAIL', 'AVERT', 'AVIAN', 'AVOID', 'AWAIT', 'AWAKE', 'AWARD', 'AWARE', 'AWASH',
        'AWFUL', 'AWOKE', 'AXIAL', 'AXIOM', 'AXION', 'AZURE', 'BACON', 'BADGE', 'BADLY',
        'BAGEL', 'BAGGY', 'BAKER', 'BALER', 'BALMY', 'BANAL', 'BANJO', 'BARGE', 'BARON',
        'BASAL', 'BASIC', 'BASIL', 'BASIN', 'BASIS', 'BASTE', 'BATCH', 'BATHE', 'BATON',
        'BATTY', 'BAWDY', 'BAYOU', 'BEACH', 'BEADY', 'BEARD', 'BEAST', 'BEECH', 'BEEFY',
        'BEFIT', 'BEGAN', 'BEGAT', 'BEGET', 'BEGIN', 'BEGUN', 'BEING', 'BELCH', 'BELIE',
        'BELLE', 'BELLY', 'BELOW', 'BENCH', 'BERET', 'BERRY', 'BERTH', 'BESET', 'BETEL',
        'BEVEL', 'BEZEL', 'BIBLE', 'BICEP', 'BIDDY', 'BIGOT', 'BILGE', 'BILLY', 'BINGE',
        'BINGO', 'BIOME', 'BIRCH', 'BIRTH', 'BISON', 'BITTY', 'BLACK', 'BLADE', 'BLAME',
        'BLAND', 'BLANK', 'BLARE', 'BLAST', 'BLAZE', 'BLEAK', 'BLEAT', 'BLEED', 'BLEEP',
        'BLEND', 'BLESS', 'BLIMP', 'BLIND', 'BLINK', 'BLISS', 'BLITZ', 'BLOAT', 'BLOCK',
        'BLOKE', 'BLOND', 'BLOOD', 'BLOOM', 'BLOWN', 'BLUER', 'BLUFF', 'BLUNT', 'BLURB',
        'BLURT', 'BLUSH', 'BOARD', 'BOAST', 'BOBBY', 'BONEY', 'BONGO', 'BONUS', 'BOOBY',
        'BOOST', 'BOOTH', 'BOOTY', 'BOOZE', 'BOOZY', 'BORAX', 'BORNE', 'BOSOM', 'BOSSY',
        'BOTCH', 'BOUGH', 'BOULE', 'BOUND', 'BOWEL', 'BOXER', 'BRACE', 'BRAID', 'BRAIN',
        'BRAKE', 'BRAND', 'BRASH', 'BRASS', 'BRAVE', 'BRAVO', 'BRAWL', 'BRAWN', 'BREAD',
        'BREAK', 'BREED', 'BRIAR', 'BRIBE', 'BRICK', 'BRIDE', 'BRIEF', 'BRINE', 'BRING',
        'BRINK', 'BRINY', 'BRISK', 'BROAD', 'BROIL', 'BROKE', 'BROOD', 'BROOK', 'BROOM',
        'BROTH', 'BROWN', 'BRUSH', 'BRUTE', 'BUDDY', 'BUDGE', 'BUGGY', 'BUGLE', 'BUILD',
        'BUILT', 'BULGE', 'BULKY', 'BULLY', 'BUNCH', 'BUNNY', 'BURLY', 'BURNT', 'BURST',
        'BUSED', 'BUSHY', 'BUTCH', 'BUTTE', 'BUXOM', 'BUYER', 'BYLAW', 'CABAL', 'CABBY',
        'CABIN', 'CABLE', 'CACAO', 'CACHE', 'CACTI', 'CADDY', 'CADET', 'CAGEY', 'CAIRN',
        'CAMEL', 'CAMEO', 'CANAL', 'CANDY', 'CANNY', 'CANOE', 'CANON', 'CAPER', 'CAPUT',
        'CARAT', 'CARGO', 'CAROL', 'CARRY', 'CARVE', 'CASTE', 'CATCH', 'CATER', 'CATTY',
        'CAULK', 'CAUSE', 'CAVIL', 'CEASE', 'CEDAR', 'CELLO', 'CHAFE', 'CHAFF', 'CHAIN',
        'CHAIR', 'CHALK', 'CHAMP', 'CHANT', 'CHAOS', 'CHARD', 'CHARM', 'CHART', 'CHASE',
        'CHASM', 'CHEAP', 'CHEAT', 'CHECK', 'CHEEK', 'CHEER', 'CHESS', 'CHEST', 'CHICK',
        'CHIDE', 'CHIEF', 'CHILD', 'CHILI', 'CHILL', 'CHIME', 'CHINA', 'CHIRP', 'CHOCK',
        'CHOIR', 'CHOKE', 'CHORD', 'CHORE', 'CHOSE', 'CHUCK', 'CHUMP', 'CHUNK', 'CHURN',
        'CHUTE', 'CIDER', 'CIGAR', 'CINCH', 'CIRCA', 'CIVIC', 'CIVIL', 'CLACK', 'CLAIM',
        'CLAMP', 'CLANG', 'CLANK', 'CLASH', 'CLASP', 'CLASS', 'CLEAN', 'CLEAR', 'CLEAT',
        'CLEFT', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLING', 'CLINK', 'CLOAK', 'CLOCK',
        'CLONE', 'CLOSE', 'CLOTH', 'CLOUD', 'CLOUT', 'CLOVE', 'CLOWN', 'CLUCK', 'CLUED',
        'CLUMP', 'CLUNG', 'COACH', 'COAST', 'COBRA', 'COCOA', 'COLON', 'COLOR', 'COMET',
        'COMFY', 'COMIC', 'COMMA', 'CONCH', 'CONDO', 'CONIC', 'COPSE', 'CORAL', 'CORER',
        'CORKY', 'CORNY', 'COULD', 'COUNT', 'COUPE', 'COURT', 'COVEN', 'COVER', 'COVET',
        'COVEY', 'COWER', 'COYLY', 'CRACK', 'CRAFT', 'CRAMP', 'CRANE', 'CRANK', 'CRASH',
        'CRASS', 'CRATE', 'CRAVE', 'CRAWL', 'CRAZE', 'CRAZY', 'CREAK', 'CREAM', 'CREDO',
        'CREED', 'CREEK', 'CREEP', 'CREME', 'CREPE', 'CREPT', 'CRESS', 'CREST', 'CRICK',
        'CRIED', 'CRIER', 'CRIME', 'CRIMP', 'CRISP', 'CROAK', 'CROCK', 'CRONE', 'CRONY',
        'CROOK', 'CROSS', 'CROUP', 'CROWD', 'CROWN', 'CRUDE', 'CRUEL', 'CRUMB', 'CRUMP',
        'CRUSH', 'CRUST', 'CRYPT', 'CUBIC', 'CUMIN', 'CURIO', 'CURLY', 'CURRY', 'CURSE',
        'CURVE', 'CURVY', 'CUTIE', 'CYBER', 'CYCLE', 'CYNIC', 'DADDY', 'DAILY', 'DAIRY',
        'DAISY', 'DALLY', 'DANCE', 'DANDY', 'DATUM', 'DAUNT', 'DEALT', 'DEATH', 'DEBAR',
        'DEBIT', 'DEBUG', 'DEBUT', 'DECAL', 'DECAY', 'DECOR', 'DECOY', 'DECRY', 'DEFER',
        'DEIGN', 'DEITY', 'DELAY', 'DELTA', 'DELVE', 'DEMON', 'DEMUR', 'DENIM', 'DENSE',
        'DEPOT', 'DEPTH', 'DERBY', 'DETER', 'DETOX', 'DEUCE', 'DEVIL', 'DIARY', 'DICEY',
        'DIGIT', 'DILLY', 'DIMLY', 'DINER', 'DINGO', 'DINGY', 'DIODE', 'DIRGE', 'DIRTY',
        'DISCO', 'DITCH', 'DITTO', 'DITTY', 'DIVER', 'DIZZY', 'DODGE', 'DODGY', 'DOGMA',
        'DOING', 'DOLLY', 'DONOR', 'DONUT', 'DOPEY', 'DOUBT', 'DOUGH', 'DOWDY', 'DOWEL',
        'DOWNY', 'DOWRY', 'DOZEN', 'DRAFT', 'DRAIN', 'DRAKE', 'DRAMA', 'DRANK', 'DRAPE',
        'DRAWL', 'DRAWN', 'DREAD', 'DREAM', 'DRESS', 'DRIED', 'DRIER', 'DRIFT', 'DRILL',
        'DRINK', 'DRIVE', 'DROIT', 'DROLL', 'DRONE', 'DROOL', 'DROOP', 'DROSS', 'DROVE',
        'DROWN', 'DRUID', 'DRUNK', 'DRYER', 'DRYLY', 'DUCHY', 'DULLY', 'DUMMY', 'DUMPY',
        'DUNCE', 'DUSKY', 'DUSTY', 'DUTCH', 'DUVET', 'DWARF', 'DWELL', 'DWELT', 'DYING',
        'EAGER', 'EAGLE', 'EARLY', 'EARTH', 'EASEL', 'EATEN', 'EATER', 'EBONY', 'ECLAT',
        'EDICT', 'EDIFY', 'EERIE', 'EGRET', 'EIGHT', 'EJECT', 'EKING', 'ELATE', 'ELBOW',
        'ELDER', 'ELECT', 'ELEGY', 'ELFIN', 'ELIDE', 'ELITE', 'ELOPE', 'ELUDE', 'EMAIL',
        'EMBER', 'EMCEE', 'EMPTY', 'ENACT', 'ENDOW', 'ENEMA', 'ENEMY', 'ENJOY', 'ENNUI',
        'ENSUE', 'ENTER', 'ENTRY', 'ENVOY', 'EPOCH', 'EPOXY', 'EQUAL', 'EQUIP', 'ERASE',
        'ERECT', 'ERODE', 'ERROR', 'ERUPT', 'ESSAY', 'ESTER', 'ETHER', 'ETHIC', 'ETHOS',
        'ETUDE', 'EVADE', 'EVENT', 'EVERY', 'EVICT', 'EVOKE', 'EXACT', 'EXALT', 'EXCEL',
        'EXERT', 'EXILE', 'EXIST', 'EXPEL', 'EXTOL', 'EXTRA', 'EXULT', 'EYING', 'TABLE',
        'FABLE', 'FACET', 'FAINT', 'FAIRY', 'FAITH', 'FALSE', 'FANCY', 'FANNY', 'FARCE',
        'FATAL', 'FATTY', 'FAULT', 'FAUNA', 'FAVOR', 'FEAST', 'FECAL', 'FEIGN', 'FELLA',
        'FELON', 'FEMME', 'FEMUR', 'FENCE', 'FERAL', 'FERRY', 'FETAL', 'FETCH', 'FETID',
        'FETUS', 'FEVER', 'FEWER', 'FIBER', 'FICUS', 'FIELD', 'FIEND', 'FIERY', 'FIFTH',
        'FIFTY', 'FIGHT', 'FILER', 'FILET', 'FILLY', 'FILMY', 'FILTH', 'FINAL', 'FINCH',
        'FINER', 'FIRST', 'FISHY', 'FIXER', 'FIZZY', 'FJORD', 'FLACK', 'FLAIL', 'FLAIR',
        'FLAKE', 'FLAKY', 'FLAME', 'FLANK', 'FLARE', 'FLASH', 'FLASK', 'FLECK', 'FLEET',
        'FLESH', 'FLICK', 'FLIER', 'FLING', 'FLINT', 'FLIRT', 'FLOAT', 'FLOCK', 'FLOOD',
        'FLOOR', 'FLORA', 'FLOSS', 'FLOUR', 'FLOUT', 'FLOWN', 'FLUFF', 'FLUID', 'FLUKE',
        'FLUME', 'FLUNG', 'FLUNK', 'FLUSH', 'FLUTE', 'FLYER', 'FOAMY', 'FOCAL', 'FOCUS',
        'FOGGY', 'FOIST', 'FOLIO', 'FOLLY', 'FORAY', 'FORCE', 'FORGE', 'FORGO', 'FORTE',
        'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FOYER', 'FRAIL', 'FRAME', 'FRANK', 'FRAUD',
        'FREAK', 'FREED', 'FREER', 'FRESH', 'FRIAR', 'FRIED', 'FRILL', 'FRISK', 'FRITZ',
        'FROCK', 'FROND', 'FRONT', 'FROST', 'FROTH', 'FROWN', 'FROZE', 'FRUIT', 'FUDGE',
        'FUGUE', 'FULLY', 'FUNGI', 'FUNKY', 'FUNNY', 'FUROR', 'FURRY', 'FUSSY', 'FUZZY',
        'GAFFE', 'GAILY', 'GAMER', 'GAMMA', 'GAMUT', 'GASSY', 'GAUDY', 'GAUGE', 'GAUNT',
        'GAUZE', 'GAUZY', 'GAVEL', 'GAWKY', 'GAYER', 'GAYLY', 'GAZER', 'GECKO', 'GEEKY',
        'GEESE', 'GENIE', 'GENRE', 'GHOST', 'GHOUL', 'GIANT', 'GIDDY', 'GIPSY', 'GIRLY',
        'GIRTH', 'GIVEN', 'GIVER', 'GLADE', 'GLAND', 'GLARE', 'GLASS', 'GLAZE', 'GLEAM',
        'GLEAN', 'GLIDE', 'GLINT', 'GLOAT', 'GLOBE', 'GLOOM', 'GLORY', 'GLOSS', 'GLOVE',
        'GLYPH', 'GNASH', 'GNOME', 'GODLY', 'GOING', 'GOLEM', 'GOLLY', 'GONAD', 'GONER',
        'GOODY', 'GOOEY', 'GOOFY', 'GOOSE', 'GORGE', 'GOUDA', 'GOUGE', 'GOURD', 'GOVERN',
        'GRACE', 'GRADE', 'GRAFT', 'GRAIL', 'GRAIN', 'GRAND', 'GRANT', 'GRAPE', 'GRAPH',
        'GRASP', 'GRASS', 'GRATE', 'GRAVE', 'GRAVY', 'GRAZE', 'GREAT', 'GREED', 'GREEN',
        'GREET', 'GRIEF', 'GRILL', 'GRIME', 'GRIMY', 'GRIND', 'GRIPE', 'GROAN', 'GROIN',
        'GROOM', 'GROPE', 'GROSS', 'GROUP', 'GROUT', 'GROVE', 'GROWL', 'GROWN', 'GRUEL',
        'GRUFF', 'GRUNT', 'GUARD', 'GUAVA', 'GUESS', 'GUEST', 'GUIDE', 'GUILD', 'GUILE',
        'GUILT', 'GUISE', 'GULCH', 'GULLY', 'GUMBO', 'GUMMY', 'GUPPY', 'GUSTO', 'GUSTY',
        'GYPSY', 'HABIT', 'HAIRY', 'HALVE', 'HANDY', 'HAPPY', 'HARDY', 'HAREM', 'HARPY',
        'HARRY', 'HARSH', 'HASTE', 'HASTY', 'HATCH', 'HATER', 'HAUNT', 'HAUTE', 'HAVEN',
        'HAVOC', 'HAZEL', 'HEADY', 'HEARD', 'HEART', 'HEATH', 'HEAVE', 'HEAVY', 'HEDGE',
        'HEFTY', 'HEIST', 'HELIX', 'HELLO', 'HENCE', 'HERON', 'HILLY', 'HINGE', 'HIPPO',
        'HIPPY', 'HITCH', 'HOARD', 'HOBBY', 'HOIST', 'HOLLY', 'HOMER', 'HONEY', 'HONOR',
        'HORDE', 'HORNY', 'HORSE', 'HOTEL', 'HOTLY', 'HOUND', 'HOUSE', 'HOVEL', 'HOVER',
        'HOWDY', 'HUMAN', 'HUMID', 'HUMOR', 'HUMPH', 'HUMUS', 'HUNCH', 'HUNKY', 'HURRY',
        'HUSKY', 'HUSSY', 'HUTCH', 'HYDRO', 'HYENA', 'HYMEN', 'HYPER', 'ICILY', 'ICING',
        'IDEAL', 'IDIOM', 'IDIOT', 'IDLER', 'IDYLL', 'IGLOO', 'ILIAC', 'IMAGE', 'IMBUE',
        'IMPEL', 'IMPLY', 'INANE', 'INBOX', 'INCUR', 'INDEX', 'INEPT', 'INERT', 'INFER',
        'INGOT', 'INLAY', 'INLET', 'INNER', 'INPUT', 'INTER', 'INTRO', 'IONIC', 'IRATE',
        'IRONY', 'ISLET', 'ISSUE', 'ITCHY', 'IVORY', 'JAUNT', 'JAZZY', 'JELLY', 'JERKY',
        'JETTY', 'JEWEL', 'JIFFY', 'JOINT', 'JOIST', 'JOKER', 'JOLLY', 'JOUST', 'JUDGE',
        'JUICE', 'JUICY', 'JUMBO', 'JUMPY', 'JUNTA', 'JUNTO', 'JUROR', 'KAPPA', 'KARMA',
        'KAYAK', 'KEBAB', 'KHAKI', 'KINKY', 'KIOSK', 'KITTY', 'KNACK', 'KNAVE', 'KNEAD',
        'KNEED', 'KNEEL', 'KNELT', 'KNIFE', 'KNOCK', 'KNOLL', 'KNOWN', 'KOALA', 'KRILL',
        'LABEL', 'LABOR', 'LADEN', 'LADLE', 'LAGER', 'LANCE', 'LANKY', 'LAPEL', 'LAPSE',
        'LARGE', 'LARVA', 'LASSO', 'LATCH', 'LATER', 'LATHE', 'LATTE', 'LAUGH', 'LAYER',
        'LEACH', 'LEAFY', 'LEAKY', 'LEANT', 'LEAPT', 'LEARN', 'LEASE', 'LEASH', 'LEAST',
        'LEAVE', 'LEDGE', 'LEECH', 'LEERY', 'LEFTY', 'LEGAL', 'LEGGY', 'LEMON', 'LEMUR',
        'LEPER', 'LEVEL', 'LEVER', 'LIBEL', 'LIEGE', 'LIGHT', 'LIKEN', 'LILAC', 'LIMBO',
        'LIMIT', 'LINEN', 'LINER', 'LINGO', 'LIPID', 'LITHE', 'LIVER', 'LIVID', 'LLAMA',
        'LOAMY', 'LOATH', 'LOBBY', 'LOCAL', 'LOCUS', 'LODGE', 'LOFTY', 'LOGIC', 'LOGIN',
        'LOOPY', 'LOOSE', 'LORRY', 'LOSER', 'LOUSE', 'LOUSY', 'LOVER', 'LOWER', 'LOWLY',
        'LOYAL', 'LUCID', 'LUCKY', 'LUMEN', 'LUMPY', 'LUNAR', 'LUNCH', 'LUNGE', 'LUPUS',
        'LURCH', 'LURID', 'LUSTY', 'LYING', 'LYMPH', 'LYNCH', 'LYRIC', 'MACAW', 'MACHO',
        'MACRO', 'MADAM', 'MADLY', 'MAFIA', 'MAGIC', 'MAGMA', 'MAIZE', 'MAJOR', 'MAKER',
        'MAMBO', 'MAMMA', 'MAMMY', 'MANGA', 'MANGE', 'MANGO', 'MANGY', 'MANIA', 'MANIC',
        'MANLY', 'MANOR', 'MAPLE', 'MARCH', 'MARRY', 'MARSH', 'MASON', 'MASSE', 'MATCH',
        'MATEY', 'MAUVE', 'MAXIM', 'MAYBE', 'MAYOR', 'MEALY', 'MEANT', 'MEATY', 'MECCA',
        'MEDAL', 'MEDIA', 'MEDIC', 'MELEE', 'MELON', 'MERCY', 'MERGE', 'MERIT', 'MERRY',
        'METAL', 'METER', 'METRO', 'MICRO', 'MIDGE', 'MIDST', 'MIGHT', 'MILKY', 'MIMIC',
        'MINCE', 'MINER', 'MINIM', 'MINOR', 'MINTY', 'MINUS', 'MIRTH', 'MISER', 'MISSY',
        'MOCHA', 'MODAL', 'MODEL', 'MODEM', 'MOGUL', 'MOIST', 'MOLAR', 'MOLDY', 'MONEY',
        'MONTH', 'MOODY', 'MOOSE', 'MORAL', 'MORON', 'MORPH', 'MOSSY', 'MOTEL', 'MOTIF',
        'MOTOR', 'MOTTO', 'MOULT', 'MOUND', 'MOUNT', 'MOURN', 'MOUSE', 'MOUTH', 'MOVER',
        'MOVIE', 'MOWER', 'MUCKY', 'MUCUS', 'MUDDY', 'MULCH', 'MUMMY', 'MUNCH', 'MURAL',
        'MURKY', 'MUSHY', 'MUSIC', 'MUSKY', 'MUSTY', 'MYRRH', 'NADIR', 'NAIVE', 'NAPPY',
        'NASAL', 'NASTY', 'NATAL', 'NAVAL', 'NAVEL', 'NEEDY', 'NEIGH', 'NERDY', 'NERVE',
        'NEVER', 'NEWER', 'NEWLY', 'NEXUS', 'NICHE', 'NIECE', 'NIGHT', 'NINJA', 'NINNY',
        'NINTH', 'NOBLE', 'NOBLY', 'NOISE', 'NOISY', 'NOMAD', 'NOOSE', 'NORTH', 'NOSEY',
        'NOTCH', 'NOVEL', 'NUDGE', 'NURSE', 'NUTTY', 'NYLON', 'NYMPH', 'OAKEN', 'OBESE',
        'OCCUR', 'OCEAN', 'OCTAL', 'OCTET', 'ODDER', 'ODDLY', 'OFFAL', 'OFFER', 'OFTEN',
        'OLDEN', 'OLDER', 'OLIVE', 'OMBRE', 'OMEGA', 'ONION', 'ONSET', 'OPERA', 'OPINE',
        'OPIUM', 'OPTIC', 'ORBIT', 'ORDER', 'ORGAN', 'OTHER', 'OTTER', 'OUGHT', 'OUNCE',
        'OUTDO', 'OUTER', 'OUTGO', 'OVARY', 'OVATE', 'OVERT', 'OVINE', 'OVOID', 'OWING',
        'OWNER', 'OXIDE', 'OZONE', 'PADDY', 'PAGAN', 'PAINT', 'PALER', 'PALSY', 'PANEL',
        'PANIC', 'PANSY', 'PAPAL', 'PAPER', 'PARER', 'PARKA', 'PARRY', 'PARSE', 'PARTY',
        'PASTA', 'PASTE', 'PASTY', 'PATCH', 'PATIO', 'PATSY', 'PATTY', 'PAUSE', 'PAYEE',
        'PAYER', 'PEACE', 'PEACH', 'PEARL', 'PECAN', 'PEDAL', 'PENAL', 'PENCE', 'PENNE',
        'PENNY', 'PERCH', 'PERIL', 'PERKY', 'PESKY', 'PESTO', 'PETAL', 'PETTY', 'PHASE',
        'PHONE', 'PHONY', 'PHOTO', 'PIANO', 'PICKY', 'PIECE', 'PIETY', 'PIGGY', 'PILOT',
        'PINCH', 'PINEY', 'PINKY', 'PINTO', 'PIPER', 'PIQUE', 'PITCH', 'PITHY', 'PIVOT',
        'PIXEL', 'PIXIE', 'PIZZA', 'PLACE', 'PLAID', 'PLAIN', 'PLAIT', 'PLANE', 'PLANK',
        'PLANT', 'PLATE', 'PLAZA', 'PLEAD', 'PLEAT', 'PLIED', 'PLIER', 'PLUCK', 'PLUMB',
        'PLUME', 'PLUMP', 'PLUNK', 'PLUSH', 'POESY', 'POINT', 'POISE', 'POKER', 'POLAR',
        'POLKA', 'POLYP', 'POOCH', 'POPPY', 'PORCH', 'POSER', 'POSIT', 'POSSE', 'POUCH',
        'POUND', 'POUTY', 'POWER', 'PRANK', 'PRAWN', 'PREEN', 'PRESS', 'PRICE', 'PRICK',
        'PRIDE', 'PRIED', 'PRIME', 'PRIMO', 'PRINT', 'PRIOR', 'PRISM', 'PRIVY', 'PRIZE',
        'PROBE', 'PRONE', 'PRONG', 'PROOF', 'PROSE', 'PROUD', 'PROVE', 'PROWL', 'PROXY',
        'PRUDE', 'PRUNE', 'PSALM', 'PUBIC', 'PUDGY', 'PUFFY', 'PULPY', 'PULSE', 'PUNCH',
        'PUPAL', 'PUPIL', 'PUPPY', 'PUREE', 'PURER', 'PURGE', 'PURSE', 'PUSH', 'PUTTY',
        'PYGMY', 'QUACK', 'QUAIL', 'QUAKE', 'QUALM', 'QUARK', 'QUART', 'QUASH', 'QUASI',
        'QUEEN', 'QUEER', 'QUELL', 'QUERY', 'QUEST', 'QUEUE', 'QUICK', 'QUIET', 'QUILL',
        'QUILT', 'QUIRK', 'QUITE', 'QUOTA', 'QUOTE', 'QUOTH', 'RABBI', 'RABID', 'RACER',
        'RADAR', 'RADII', 'RADIO', 'RAINY', 'RAISE', 'RAJAH', 'RALLY', 'RALPH', 'RAMEN',
        'RANCH', 'RANDY', 'RANGE', 'RAPID', 'RARER', 'RASPY', 'RATIO', 'RATTY', 'RAVEN',
        'RAYON', 'RAZOR', 'REACH', 'REACT', 'READY', 'REALM', 'REARM', 'REBAR', 'REBEL',
        'REBUS', 'REBUT', 'RECAP', 'RECUR', 'RECUT', 'REEDY', 'REFER', 'REFIT', 'REGAL',
        'REHAB', 'REIGN', 'REL', 'RELAX', 'RELAY', 'RELIC', 'REMIT', 'RENAL', 'RENEW',
        'REPAY', 'REPEL', 'REPLY', 'RERUN', 'RESET', 'RESIN', 'RETCH', 'RETRO', 'RETRY',
        'REUSE', 'REVEL', 'REVUE', 'RHINO', 'RHYME', 'RIDER', 'RIDGE', 'RIFLE', 'RIGHT',
        'RIGID', 'RIGOR', 'RINSE', 'RIPEN', 'RIPER', 'RISEN', 'RISKY', 'RIVAL', 'RIVER',
        'RIVET', 'ROACH', 'ROAST', 'ROBIN', 'ROBOT', 'ROCKY', 'RODEO', 'ROGER', 'ROGUE',
        'ROOMY', 'ROOST', 'ROTOR', 'ROUGE', 'ROUGH', 'ROUND', 'ROUSE', 'ROUTE', 'ROVER',
        'ROWDY', 'ROWER', 'ROYAL', 'RUDDY', 'RUDER', 'RUGBY', 'RULER', 'RUMBA', 'RUMOR',
        'RUPEE', 'RURAL', 'RUSTY', 'SADLY', 'SAFER', 'SAINT', 'SALAD', 'SALLY', 'SALON',
        'SALSA', 'SALTY', 'SALVE', 'SALVO', 'SANDY', 'SANER', 'SAPPY', 'SASSY', 'SATIN',
        'SATYR', 'SAUCE', 'SAUCY', 'SAUNA', 'SAUTE', 'SAVOR', 'SAVOY', 'SAVVY', 'SCALD',
        'SCALE', 'SCALP', 'SCALY', 'SCAMP', 'SCANT', 'SCARE', 'SCARF', 'SCARY', 'SCENE',
        'SCENT', 'SCION', 'SCOFF', 'SCOLD', 'SCONE', 'SCOOP', 'SCOPE', 'SCORE', 'SCORN',
        'SCOUR', 'SCOUT', 'SCOWL', 'SCRAM', 'SCRAP', 'SCREE', 'SCREW', 'SCRUB', 'SCRUM',
        'SCUBA', 'SEDAN', 'SEEDY', 'SEGUE', 'SEIZE', 'SEMEN', 'SENSE', 'SEPIA', 'SERIF',
        'SERUM', 'SERVE', 'SETUP', 'SEVEN', 'SEVER', 'SEWER', 'SHACK', 'SHADE', 'SHADY',
        'SHAFT', 'SHAKE', 'SHAKY', 'SHALE', 'SHALL', 'SHALT', 'SHAME', 'SHANK', 'SHAPE',
        'SHARD', 'SHARE', 'SHARK', 'SHARP', 'SHAVE', 'SHAWL', 'SHEAR', 'SHEEN', 'SHEEP',
        'SHEER', 'SHEET', 'SHEIK', 'SHELF', 'SHELL', 'SHIED', 'SHIFT', 'SHINE', 'SHINY',
        'SHIRE', 'SHIRK', 'SHIRT', 'SHOAL', 'SHOCK', 'SHONE', 'SHOOK', 'SHOOT', 'SHORE',
        'SHORN', 'SHORT', 'SHOUT', 'SHOVE', 'SHOWN', 'SHOWY', 'SHREW', 'SHRUB', 'SHRUG',
        'SHUCK', 'SHUNT', 'SHUSH', 'SHYLY', 'SIEGE', 'SIEVE', 'SIGHT', 'SIGMA', 'SILKY',
        'SILLY', 'SINCE', 'SINEW', 'SINGE', 'SIREN', 'SISSY', 'SIXTH', 'SIXTY', 'SKATE',
        'SKIER', 'SKIFF', 'SKILL', 'SKIMP', 'SKIRT', 'SKULK', 'SKULL', 'SKUNK', 'SLACK',
        'SLAIN', 'SLANG', 'SLANT', 'SLASH', 'SLATE', 'SLAVE', 'SLEEK', 'SLEEP', 'SLEET',
        'SLEPT', 'SLICE', 'SLICK', 'SLIDE', 'SLIME', 'SLIMY', 'SLING', 'SLINK', 'SLOOP',
        'SLOPE', 'SLOSH', 'SLOTH', 'SLUMP', 'SLUNG', 'SLUNK', 'SLURP', 'SLUSH', 'SLYLY',
        'SMACK', 'SMALL', 'SMART', 'SMASH', 'SMEAR', 'SMELL', 'SMELT', 'SMILE', 'SMIRK',
        'SMITE', 'SMITH', 'SMOCK', 'SMOKE', 'SMOKY', 'SMOTE', 'SNACK', 'SNAIL', 'SNAKE',
        'SNAKY', 'SNARE', 'SNARL', 'SNEAK', 'SNEER', 'SNIDE', 'SNIFF', 'SNIPE', 'SNOOP',
        'SNORE', 'SNORT', 'SNOUT', 'SNOWY', 'SNUCK', 'SNUFF', 'SOAPY', 'SOBER', 'SOGGY',
        'SOLAR', 'SOLID', 'SOLVE', 'SONAR', 'SONIC', 'SOOTH', 'SOOTY', 'SORRY', 'SOUND',
        'SOUTH', 'SOWER', 'SPACE', 'SPADE', 'SPANK', 'SPARE', 'SPARK', 'SPASM', 'SPAWN',
        'SPEAK', 'SPEAR', 'SPECK', 'SPEED', 'SPELL', 'SPELT', 'SPEND', 'SPENT', 'SPERM',
        'SPICE', 'SPICY', 'SPIED', 'SPIEL', 'SPIKE', 'SPIKY', 'SPILL', 'SPILT', 'SPINE',
        'SPINY', 'SPIRE', 'SPITE', 'SPLAT', 'SPLIT', 'SPOIL', 'SPOKE', 'SPOOF', 'SPOOK',
        'SPOOL', 'SPOON', 'SPORE', 'SPORT', 'SPOUT', 'SPRAY', 'SPREE', 'SPRIG', 'SPUNK',
        'SPURN', 'SPURT', 'SQUAD', 'SQUAT', 'SQUIB', 'STACK', 'STAFF', 'STAGE', 'STAID',
        'STAIN', 'STAIR', 'STAKE', 'STALE', 'STALK', 'STALL', 'STAMP', 'STAND', 'STANK',
        'STARE', 'STARK', 'START', 'STASH', 'STATE', 'STAVE', 'STEAD', 'STEAK', 'STEAL',
        'STEAM', 'STEED', 'STEEL', 'STEEP', 'STEER', 'STEIN', 'STERN', 'STICK', 'STIFF',
        'STILL', 'STILT', 'STING', 'STINK', 'STINT', 'STOCK', 'STOIC', 'STOKE', 'STOLE',
        'STOMP', 'STONE', 'STONY', 'STOOD', 'STOOL', 'STOOP', 'STORE', 'STORK', 'STORM',
        'STORY', 'STOUT', 'STOVE', 'STRAP', 'STRAW', 'STRAY', 'STRIP', 'STRUT', 'STUCK',
        'STUDY', 'STUFF', 'STUMP', 'STUNG', 'STUNK', 'STUNT', 'STYLE', 'SUAVE', 'SUGAR',
        'SUING', 'SUITE', 'SULKY', 'SULLY', 'SUMAC', 'SUNNY', 'SUPER', 'SURER', 'SURGE',
        'SURLY', 'SUSHI', 'SWAMI', 'SWAMP', 'SWARM', 'SWASH', 'SWATH', 'SWEAR', 'SWEAT',
        'SWEEP', 'SWEET', 'SWELL', 'SWEPT', 'SWIFT', 'SWILL', 'SWINE', 'SWING', 'SWIRL',
        'SWISH', 'SWOON', 'SWOOP', 'SWORD', 'SWORE', 'SWORN', 'SWUNG', 'SYNOD', 'SYRUP',
        'TABBY', 'TABLE', 'TABOO', 'TACIT', 'TACKY', 'TAFFY', 'TAINT', 'TAKEN', 'TALON',
        'TAMER', 'TANGO', 'TANGY', 'TAPER', 'TAPIR', 'TARDY', 'TAROT', 'TASTE', 'TASTY',
        'TATTY', 'TAUNT', 'TAWNY', 'TEACH', 'TEARY', 'TEASE', 'TEDDY', 'TEETH', 'TEMPO',
        'TENET', 'TENOR', 'TENSE', 'TENTH', 'TEPEE', 'TEPID', 'TERRA', 'TERSE', 'TESTY',
        'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THETA', 'THICK', 'THIEF',
        'THIGH', 'THING', 'THINK', 'THIRD', 'THONG', 'THORN', 'THOSE', 'THREE', 'THREW',
        'THROB', 'THROW', 'THRUM', 'THUMB', 'THUMP', 'THYME', 'TIARA', 'TIBIA', 'TIDAL',
        'TIGER', 'TIGHT', 'TILDE', 'TIMER', 'TIMID', 'TIPSY', 'TITAN', 'TITHE', 'TITLE',
        'TOAST', 'TODAY', 'TODDY', 'TOKEN', 'TONAL', 'TONGA', 'TONIC', 'TOOTH', 'TOPAZ',
        'TOPIC', 'TORCH', 'TORSO', 'TORUS', 'TOTAL', 'TOTEM', 'TOUCH', 'TOUGH', 'TOWEL',
        'TOWER', 'TOXIC', 'TOXIN', 'TRACE', 'TRACK', 'TRACT', 'TRADE', 'TRAIL', 'TRAIN',
        'TRAIT', 'TRAMP', 'TRASH', 'TRAWL', 'TREAD', 'TREAT', 'TREND', 'TRIAD', 'TRIAL',
        'TRIBE', 'TRICE', 'TRICK', 'TRIED', 'TRIPE', 'TRITE', 'TROLL', 'TROOP', 'TROPE',
        'TROUT', 'TROVE', 'TRUCE', 'TRUCK', 'TRUER', 'TRULY', 'TRUMP', 'TRUNK', 'TRUSS',
        'TRUST', 'TRUTH', 'TRYST', 'TUBAL', 'TUBER', 'TULIP', 'TULLE', 'TUMOR', 'TUNIC',
        'TURBO', 'TUTOR', 'TWANG', 'TWEAK', 'TWEED', 'TWEET', 'TWICE', 'TWINE', 'TWIRL',
        'TWIST', 'TWIXT', 'TYING', 'UDDER', 'ULCER', 'ULTRA', 'UMBRA', 'UNCLE', 'UNCUT',
        'UNDER', 'UNDID', 'UNDUE', 'UNFED', 'UNFIT', 'UNIFY', 'UNION', 'UNITE', 'UNITY',
        'UNLIT', 'UNMET', 'UNSET', 'UNTIE', 'UNTIL', 'UNWED', 'UNZIP', 'UPPER', 'UPSET',
        'URBAN', 'URINE', 'USAGE', 'USHER', 'USING', 'USUAL', 'USURP', 'UTILE', 'UTTER',
        'VAGUE', 'VALET', 'VALID', 'VALOR', 'VALUE', 'VALVE', 'VAPID', 'VAPOR', 'VAULT',
        'VAUNT', 'VEGAN', 'VENOM', 'VENUE', 'VERGE', 'VERSE', 'VERSO', 'VERVE', 'VICAR',
        'VIDEO', 'VIGIL', 'VIGOR', 'VILLA', 'VINYL', 'VIOLA', 'VIPER', 'VIRAL', 'VIRUS',
        'VISIT', 'VISOR', 'VISTA', 'VITAL', 'VIVID', 'VIXEN', 'VOCAL', 'VODKA', 'VOGUE',
        'VOICE', 'VOILA', 'VOMIT', 'VOTER', 'VOUCH', 'VOWEL', 'VYING', 'WACKY', 'WAFER',
        'WAGER', 'WAGON', 'WAIST', 'WAIVE', 'WALTZ', 'WARTY', 'WASTE', 'WATCH', 'WATER',
        'WAVER', 'WAXEN', 'WEARY', 'WEAVE', 'WEDGE', 'WEEDY', 'WEIGH', 'WEIRD', 'WELCH',
        'WELSH', 'WENCH', 'WHACK', 'WHALE', 'WHARF', 'WHEAT', 'WHEEL', 'WHELP', 'WHERE',
        'WHICH', 'WHIFF', 'WHILE', 'WHINE', 'WHINY', 'WHIRL', 'WHISK', 'WHITE', 'WHOLE',
        'WHOOP', 'WHOSE', 'WIDEN', 'WIDER', 'WIDOW', 'WIDTH', 'WIELD', 'WIGHT', 'WILLY',
        'WIMPY', 'WINCE', 'WINCH', 'WINDY', 'WING', 'WINER', 'WING', 'WINK', 'WINNY',
        'WIPER', 'WIRTY', 'WISPY', 'WITCH', 'WITTY', 'WOKEN', 'WOMAN', 'WOMEN', 'WOODY',
        'WOOER', 'WOOLY', 'WORDY', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD',
        'WOUND', 'WOVEN', 'WRACK', 'WRATH', 'WREAK', 'WRECK', 'WREST', 'WRING', 'WRIST',
        'WRITE', 'WRONG', 'WROTE', 'WRUNG', 'WRYLY', 'YACHT', 'YEARN', 'YEAST', 'YIELD',
        'YOUNG', 'YOUTH', 'ZEBRA', 'ZESTY', 'ZONAL'
    ];
    
    const TARGET_WORDS = [
        // Selected words for answers (365+ unique words)
        'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADAPT', 'ADMIT', 'ADULT', 'AFTER',
        'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW',
        'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART',
        'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AUDIO',
        'AVOID', 'AWARD', 'AWARE', 'BADLY', 'BASIC', 'BASIS', 'BEACH', 'BEGIN', 'BEING',
        'BELOW', 'BENCH', 'BIRTH', 'BLACK', 'BLAME', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD',
        'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF',
        'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CARRY',
        'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST',
        'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR',
        'CLICK', 'CLOCK', 'CLOSE', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER',
        'CRAFT', 'CRASH', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CURVE', 'CYCLE',
        'DAILY', 'DANCE', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DENSE', 'DEPTH', 'DOING',
        'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK',
        'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELECT', 'ELITE',
        'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY',
        'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH',
        'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID',
        'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD',
        'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE',
        'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN',
        'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HEART',
        'HEAVY', 'HENCE', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'IMPLY',
        'INNER', 'INPUT', 'ISSUE', 'JOINT', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER',
        'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL',
        'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY',
        'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MATCH', 'MAYBE', 'MAYOR',
        'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY',
        'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC', 'NEEDS',
        'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR',
        'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER',
        'PARTY', 'PEACE', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH',
        'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS',
        'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE',
        'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO',
        'REACH', 'REACT', 'READY', 'REFER', 'RIGHT', 'RIVAL', 'RIVER', 'ROUND', 'ROUTE',
        'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN',
        'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHIRT',
        'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED',
        'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SOLAR',
        'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED',
        'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND',
        'START', 'STATE', 'STEAM', 'STEEL', 'STEEP', 'STICK', 'STILL', 'STOCK', 'STONE',
        'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE',
        'SUGAR', 'SUITE', 'SUNNY', 'SUPER', 'SWEET', 'TABLE', 'TAKEN', 'TASTE', 'TAXES',
        'TEACH', 'TEETH', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK',
        'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'TIGHT', 'TIMES',
        'TITLE', 'TODAY', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE',
        'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TROOP',
        'TRUCK', 'TRULY', 'TRUST', 'TRUTH', 'TWICE', 'UNDER', 'UNDUE', 'UNION', 'UNITY',
        'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO',
        'VIRUS', 'VISIT', 'VITAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE',
        'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY',
        'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE', 'YIELD',
        'YOUNG', 'YOUTH', 'ZEBRA'
    ];
    
    // Initialize game
    function initGame() {
        // Get DOM elements
        remainingEl = document.getElementById('remaining');
        messageEl = document.getElementById('message');
        gridEl = document.querySelector('.word-grid');
        keyboardEl = document.querySelector('.keyboard');
        
        // Get today's word (based on date)
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const wordIndex = dayOfYear % TARGET_WORDS.length;
        gameState.targetWord = TARGET_WORDS[wordIndex];
        
        console.log('Target word:', gameState.targetWord); // For debugging
        
        // Clear any existing game state
        gameState.currentRow = 0;
        gameState.currentCol = 0;
        gameState.gameOver = false;
        gameState.gameWon = false;
        
        // Clear message
        messageEl.textContent = '';
        
        // Reset tiles
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.textContent = '';
            tile.className = 'tile';
        });
        
        // Reset keyboard
        const keys = document.querySelectorAll('.key, .lr');
        keys.forEach(key => {
            key.className = key.className.split(' ')[0]; // Remove color classes
            if (key.classList.contains('enter')) key.classList.add('enter');
            if (key.classList.contains('backspace')) key.classList.add('backspace');
            if (key.classList.contains('spacer')) key.classList.add('spacer');
            if (key.classList.contains('lr')) key.classList.add('lr');
        });
        
        // Update attempts
        remainingEl.textContent = MAX_ATTEMPTS;
        
        // Add event listeners
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Keyboard click events
        document.querySelectorAll('.key, .lr').forEach(key => {
            key.addEventListener('click', handleKeyClick);
        });
        
        // Physical keyboard events
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // Handle virtual keyboard clicks
    function handleKeyClick(e) {
        if (gameState.gameOver) return;
        
        const key = e.target;
        const action = key.dataset.action;
        const letter = key.dataset.key;
        
        if (action === 'enter') {
            submitGuess();
        } else if (action === 'backspace') {
            deleteLetter();
        } else if (action === 'space') {
            // Space key does nothing
        } else if (letter) {
            addLetter(letter);
            
            // Create floating animation
            createFloatingAnimation(key, letter);
        }
    }
    
    // Handle physical keyboard
    function handleKeyPress(e) {
        if (gameState.gameOver) return;
        
        const key = e.key.toUpperCase();
        
        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE' || key === 'DELETE') {
            deleteLetter();
        } else if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }
    
    // Add a letter to the current guess
    function addLetter(letter) {
        if (gameState.currentCol >= WORD_LENGTH) return;
        
        const tile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${gameState.currentCol}"]`);
        if (tile) {
            tile.textContent = letter;
            tile.classList.add('filled');
            gameState.currentCol++;
        }
    }
    
    // Delete the last letter
    function deleteLetter() {
        if (gameState.currentCol <= 0) return;
        
        gameState.currentCol--;
        const tile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${gameState.currentCol}"]`);
        if (tile) {
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    }
    
    // Submit the current guess
    function submitGuess() {
        // Check if word is complete
        if (gameState.currentCol !== WORD_LENGTH) {
            showMessage('Not enough letters!');
            shakeRow(gameState.currentRow);
            return;
        }
        
        // Get the current guess
        let guess = '';
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${i}"]`);
            guess += tile.textContent;
        }
        
        // Check if word is valid
        if (!VALID_WORDS.includes(guess)) {
            showMessage('Not in word list!');
            shakeRow(gameState.currentRow);
            return;
        }
        
        // Check the guess
        const result = checkGuess(guess);
        
        // Update tiles and keyboard
        updateTiles(result);
        updateKeyboard(result);
        
        // Check for win
        if (guess === gameState.targetWord) {
            gameState.gameOver = true;
            gameState.gameWon = true;
            showMessage('You win!', true);
            return;
        }
        
        // Move to next row
        gameState.currentRow++;
        gameState.currentCol = 0;
        
        // Update remaining attempts
        const remaining = MAX_ATTEMPTS - gameState.currentRow;
        remainingEl.textContent = remaining;
        
        // Check for game over
        if (gameState.currentRow >= MAX_ATTEMPTS) {
            gameState.gameOver = true;
            showMessage(`Game over! The word was: ${gameState.targetWord}`);
            return;
        }
        
        // Clear message
        messageEl.textContent = '';
    }
    
    // Check the guess against the target word
    function checkGuess(guess) {
        const result = [];
        const target = gameState.targetWord;
        const targetLetters = target.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = { letter: guessLetters[i], status: 'correct' };
                targetLetters[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (!result[i]) { // Not already marked as correct
                const index = targetLetters.indexOf(guessLetters[i]);
                if (index !== -1) {
                    result[i] = { letter: guessLetters[i], status: 'present' };
                    targetLetters[index] = null; // Mark as used
                } else {
                    result[i] = { letter: guessLetters[i], status: 'incorrect' };
                }
            }
        }
        
        return result;
    }
    
    // Update tiles with the result
    function updateTiles(result) {
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${i}"]`);
            if (tile) {
                // Add color class with delay for animation
                setTimeout(() => {
                    tile.classList.add(result[i].status);
                }, i * 300);
            }
        }
    }
    
    // Update keyboard with the result
    function updateKeyboard(result) {
        result.forEach(item => {
            const key = document.querySelector(`[data-key="${item.letter}"]`);
            if (key) {
                // Only update if the new status is better than current
                const currentStatus = key.classList.contains('correct') ? 'correct' :
                                     key.classList.contains('present') ? 'present' :
                                     key.classList.contains('incorrect') ? 'incorrect' : '';
                
                if (item.status === 'correct' || 
                    (item.status === 'present' && currentStatus !== 'correct') ||
                    (item.status === 'incorrect' && !currentStatus)) {
                    key.classList.remove('correct', 'present', 'incorrect');
                    key.classList.add(item.status);
                }
            }
        });
    }
    
    // Show message
    function showMessage(text, isSuccess = false) {
        messageEl.textContent = text;
        messageEl.style.color = isSuccess ? CORRECT_COLOR : INCORRECT_COLOR;
    }
    
    // Shake animation for invalid word
    function shakeRow(row) {
        const tiles = document.querySelectorAll(`.tile[data-row="${row}"]`);
        tiles.forEach(tile => {
            tile.classList.add('shake');
            setTimeout(() => {
                tile.classList.remove('shake');
            }, 500);
        });
    }
    
    // Create floating letter animation
    function createFloatingAnimation(keyElement, letter) {
        const keyRect = keyElement.getBoundingClientRect();
        const targetTile = document.querySelector(`.tile[data-row="${gameState.currentRow}"][data-col="${gameState.currentCol - 1}"]`);
        
        if (!targetTile) return;
        
        const tileRect = targetTile.getBoundingClientRect();
        
        // Create floating element
        const floatEl = document.createElement('div');
        floatEl.className = 'floating-letter';
        floatEl.textContent = letter;
        floatEl.style.left = `${keyRect.left + keyRect.width / 2}px`;
        floatEl.style.top = `${keyRect.top + keyRect.height / 2}px`;
        
        document.body.appendChild(floatEl);
        
        // Animate to tile position
        setTimeout(() => {
            floatEl.style.left = `${tileRect.left + tileRect.width / 2}px`;
            floatEl.style.top = `${tileRect.top + tileRect.height / 2}px`;
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(floatEl);
        }, 800);
    }
    
    // Initialize game when DOM is loaded
    document.addEventListener('DOMContentLoaded', initGame);
})();