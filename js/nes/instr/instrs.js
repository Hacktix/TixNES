// Include instruction files
include('nes/instr/memaccess.js');
include('nes/instr/jump.js');
include('nes/instr/load.js');

// Variable Declarations
var funcmap = { };   // Maps opcodes to function callbacks
var tmp = [];        // Buffer for values that need to be preserved between cycles