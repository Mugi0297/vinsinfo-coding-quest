/* Level-specific question bank. Correct answers are kept server-side. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[5] = {
  id: 5,
  title: "Flowchart Master",
  icon: "🔀",
  description: "Flowcharts, pseudocode and dry runs.",
  topics: ["Flowchart symbols", "Pseudocode", "Tracing", "Algorithms"],
  questions: [
      {
        question: "Which flowchart symbol normally represents a decision?",
        options: ["Diamond", "Rectangle", "Oval", "Parallelogram"],
        hint: "It commonly has Yes/No branches.",
        explanation: "A diamond represents a decision or condition."
      },
      {
        question: "What is printed? SET x = 2; SET x = x + 3; PRINT x",
        options: ["2", "5", "3", "6"],
        hint: "Update x before printing it.",
        explanation: "x becomes 2 + 3, which is 5."
      },
      {
        question: "Which flowchart symbol usually represents input or output?",
        options: ["Diamond", "Rectangle", "Parallelogram", "Oval"],
        hint: "Its sides are slanted.",
        explanation: "A parallelogram typically represents input/output."
      },
      {
        question: "Which flowchart symbol marks the start or end of a flowchart?",
        options: ["Rectangle", "Diamond", "Arrow", "Oval"],
        hint: "It is rounded, like a pill shape.",
        explanation: "An oval (terminator) marks where a flowchart begins or ends."
      },
      {
        question: "What is printed? SET a = 10; SET b = 4; SET a = a - b; SET b = a + b; PRINT a, b",
        options: ["6 10", "6 4", "10 4", "4 6"],
        hint: "Each line uses the values left by the line before it.",
        explanation: "a becomes 6. Then b becomes 6 + 4 = 10. The output is 6 10."
      },
      {
        question: "What is printed? SET s = 0; FOR i = 1 TO 4: s = s + i; END FOR; PRINT s",
        options: ["4", "10", "6", "24"],
        hint: "Add 1, 2, 3 and 4 into s.",
        explanation: "1 + 2 + 3 + 4 = 10."
      },
      {
        question: "What is the last value printed? SET n = 5; WHILE n > 0: SET n = n - 2; PRINT n; END WHILE",
        options: ["1", "0", "-1", "3"],
        hint: "The loop runs while n is positive. Track n as it goes 5, 3, 1, -1.",
        explanation: "The prints are 3, then 1, then -1. At -1 the condition n > 0 is false and the loop stops."
      },
      {
        question: "What is the minimum number of comparisons needed to find the largest of 4 numbers by comparing two values at a time?",
        options: ["2", "4", "6", "3"],
        hint: "Each comparison can eliminate one number from being the current largest.",
        explanation: "Three comparisons are needed. Each one removes a candidate, leaving the largest."
      },
      {
        question: "A flowchart repeatedly runs a block of steps until a condition becomes true. Which control structure is this?",
        options: ["Iteration", "Sequence", "Selection", "Recursion only"],
        hint: "Repeating steps is the job of loops.",
        explanation: "Repeating a block of steps is iteration, usually shown with a loop back to an earlier point."
      },
      {
        question: "What is printed? SET a = 3; SET b = 9; SET t = a; SET a = b; SET b = t; PRINT a, b",
        options: ["3 9", "9 3", "9 9", "3 3"],
        hint: "t saves the old value of a before a is overwritten.",
        explanation: "The three assignments swap a and b, so a becomes 9 and b becomes 3."
      },
      {
        question: "Which flowchart symbol connects parts of a flowchart that continue on another page?",
        options: ["Diamond", "Oval", "Connector", "Document"],
        hint: "It is usually drawn as a small circle.",
        explanation: "A connector symbol links parts of a flowchart that are separated on the page."
      },
      {
        question: "Which flowchart symbol represents a printed document as output?",
        options: ["Rectangle", "Diamond", "Hexagon", "Document"],
        hint: "Its bottom edge is wavy.",
        explanation: "The document symbol has a wavy bottom to show printed output."
      },
      {
        question: "Which flowchart symbol represents a call to a predefined process or subroutine?",
        options: ["Rectangle with double vertical sides", "Diamond", "Triangle", "Oval"],
        hint: "It looks like a rectangle with extra lines on both sides.",
        explanation: "The predefined process symbol shows a call to a separate procedure."
      },
      {
        question: "What is the value of a after: SET a = 4; SET b = a * 2; SET a = b - 1; PRINT a?",
        options: ["4", "7", "8", "9"],
        hint: "b is 8 before a is updated.",
        explanation: "b = 8, then a = 8 - 1 = 7."
      },
      {
        question: "What is printed by: SET c = 0; FOR i = 1 TO 5: IF i MOD 2 = 0 THEN SET c = c + i; END IF; END FOR; PRINT c?",
        options: ["9", "15", "6", "4"],
        hint: "Only the even values of i change c.",
        explanation: "The even values are 2 and 4. Their sum is 6."
      },
      {
        question: "What is printed by: SET x = 1; REPEAT: SET x = x * 2; UNTIL x > 10; PRINT x?",
        options: ["8", "10", "20", "16"],
        hint: "REPEAT runs at least once and checks the condition at the end.",
        explanation: "x becomes 2, 4, 8 and then 16. At 16 the condition x > 10 is true, so the loop stops."
      },
      {
        question: "What is printed by: SET total = 0; SET k = 3; WHILE k <= 7: SET total = total + k; SET k = k + 2; END WHILE; PRINT total?",
        options: ["15", "10", "12", "18"],
        hint: "k takes the values 3, 5 and 7 inside the loop.",
        explanation: "total = 3 + 5 + 7 = 15."
      },
      {
        question: "How many times does the loop body run for: FOR i = 10 TO 1 STEP -3?",
        options: ["3", "4", "5", "10"],
        hint: "Count the values of i from 10 down to 1 in steps of 3.",
        explanation: "The values are 10, 7, 4 and 1, so the body runs 4 times."
      },
      {
        question: "Using SET sum = sum + item for each item, then SET avg = sum / count, what is avg for the list 2, 4 and 6?",
        options: ["3", "6", "4", "12"],
        hint: "Add the items, then divide by how many there are.",
        explanation: "The sum is 12 and the count is 3, so avg = 4."
      },
      {
        question: "Which control structure does an IF ... THEN ... ELSE block represent?",
        options: ["Sequence", "Iteration", "Parallel only", "Selection"],
        hint: "It chooses one path depending on a condition.",
        explanation: "Choosing between branches is selection."
      },
      {
        question: "Which order follows the standard input-process-output flow of a simple algorithm?",
        options: ["Input, Process, Output", "Output, Process, Input", "Process, Input, Output", "Input, Output, Process"],
        hint: "Data comes in first, then it is processed, then the result goes out.",
        explanation: "The standard order is Input, then Process, then Output."
      },
      {
        question: "What is printed by: SET a = 5; SET b = 3; IF a > b THEN SET m = a ELSE SET m = b END IF; PRINT m?",
        options: ["3", "5", "8", "2"],
        hint: "The condition a > b decides which value m receives.",
        explanation: "5 > 3 is true, so m = a = 5."
      },
      {
        question: "What is printed by: SET n = 1; WHILE n < 100: SET n = n * 3; END WHILE; PRINT n?",
        options: ["81", "100", "243", "729"],
        hint: "Multiply by 3 until n is no longer less than 100.",
        explanation: "n goes 1, 3, 9, 27, 81, 243. At 243 the condition is false."
      },
      {
        question: "What is the purpose of a dry run in algorithm design?",
        options: ["Compile the code", "Delete unused variables", "Measure memory use", "Trace the steps by hand to check the output"],
        hint: "You follow each line on paper and record the variables.",
        explanation: "A dry run checks the logic by tracing steps manually before coding."
      },
      {
        question: "What is printed by: SET flag = TRUE; SET flag = NOT flag; PRINT flag?",
        options: ["FALSE", "TRUE", "NOT", "Error"],
        hint: "NOT changes a true value into false.",
        explanation: "NOT TRUE is FALSE, so FALSE is printed."
      },
      {
        question: "What is printed by: SET x = 10; SET y = 0; WHILE x > 0: SET y = y + x; SET x = x / 2; END WHILE; PRINT y? (Use integer division.)",
        options: ["10", "18", "17", "19"],
        hint: "Track x and y on each pass. x uses integer division.",
        explanation: "x and y go: (10, 10), (5, 15), (2, 17), (1, 18), (0, 18). The printed value is 18."
      },
      {
        question: "When finding the largest value in a list by scanning it, what is a typical starting value for max?",
        options: ["0 always", "Infinity only", "The first element", "No value"],
        hint: "Starting at 0 fails when all values are negative.",
        explanation: "Setting max to the first element works for any values and is then compared with the rest."
      },
      {
        question: "What is printed by: SET i = 0; SET p = 1; WHILE i < 4: SET p = p * 2; SET i = i + 1; END WHILE; PRINT p?",
        options: ["8", "32", "4", "16"],
        hint: "The loop doubles p once for each pass.",
        explanation: "p doubles 4 times: 2, 4, 8, 16."
      },
      {
        question: "A loop checks its condition at the end, so its body always runs at least once. Which pseudocode loop does this?",
        options: ["REPEAT ... UNTIL", "WHILE", "FOR", "IF"],
        hint: "The condition is checked after the body.",
        explanation: "REPEAT ... UNTIL runs the body first, then checks the condition."
      },
      {
        question: "What is printed by: SET a = 2; SET b = a + a * 3; PRINT b?",
        options: ["12", "8", "10", "6"],
        hint: "Multiplication happens before addition.",
        explanation: "a * 3 = 6, then 2 + 6 = 8."
      }
  ]
};
