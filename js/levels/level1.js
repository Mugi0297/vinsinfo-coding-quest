/* Level-specific question bank. answer is a zero-based option index. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[1] = {
  id: 1,
  title: "Programming Basics",
  icon: "💻",
  description: "Variables, operators, conditions and loops.",
  topics: ["Variables and data types", "Operators", "if-else", "Loops"],
  questions: [
      {
        question: "Which data type stores a whole number in C?",
        options: ["int", "float", "char", "double"],
        answer: 0,
        hint: "It commonly stores values such as 10 and -5.",
        explanation: "The int data type stores integer values."
      },
      {
        question: "What is the result of 5 + 2 in C?",
        options: ["52", "7", "5", "Compilation error"],
        answer: 1,
        hint: "The + operator performs arithmetic addition.",
        explanation: "5 + 2 equals 7."
      },
      {
        question: "Which pair contains two entry-controlled loops in C?",
        options: ["do-while and while", "do-while and for", "while and for", "Neither"],
        answer: 2,
        hint: "They check the condition before the body runs.",
        explanation: "Both while and for check their condition before executing the body."
      },
      {
        question: "In C, what does printf(\"%d\", 5 / 2); print?",
        options: ["2.5", "3", "Compilation error", "2"],
        answer: 3,
        hint: "Both operands are integers, so the division is integer division.",
        explanation: "Integer division discards the fractional part, so 5 / 2 gives 2."
      },
      {
        question: "In Java, after int x = 3; what is the value of x++ + ++x?",
        options: ["8", "6", "7", "9"],
        answer: 0,
        hint: "x++ uses the old value first; ++x uses the new value.",
        explanation: "x++ gives 3 and makes x 4; ++x makes x 5 and gives 5. So 3 + 5 = 8."
      },
      {
        question: "In C, what is printed after: int n = 0; while (n < 5) { n += 2; } printf(\"%d\", n);",
        options: ["4", "6", "5", "7"],
        answer: 1,
        hint: "Track n after each pass: 0, 2, 4, 6. Check the condition before each pass.",
        explanation: "n goes 0 -> 2 -> 4 -> 6. At 6 the condition n < 5 is false, so 6 is printed."
      },
      {
        question: "In C, what is printed by: for (int i = 0; i < 3; i++) { printf(\"%d \", i * i); }",
        options: ["0 1 2", "1 4 9", "0 1 4", "0 1 4 9"],
        answer: 2,
        hint: "The loop runs for i = 0, 1 and 2 only.",
        explanation: "The loop prints 0*0, 1*1 and 2*2, which are 0, 1 and 4."
      },
      {
        question: "In C, what is printed by: int a = 0; if (a) printf(\"yes\"); else printf(\"no\");",
        options: ["yes", "Nothing", "Compilation error", "no"],
        answer: 3,
        hint: "In C, any non-zero value counts as true and zero counts as false.",
        explanation: "a is 0, which is false, so the else branch prints no."
      },
      {
        question: "In C, what is the final value of b? int a = 5; int b = a > 3 ? a * 2 : a / 2;",
        options: ["10", "2", "5", "2.5"],
        answer: 0,
        hint: "The condition a > 3 is true, so the expression before the colon is chosen.",
        explanation: "a > 3 is true, so b = a * 2 = 10."
      },
      {
        question: "In Java, what happens when you compile: char c = 'A'; c = c + 2;",
        options: ["c becomes 'C'", "Compilation error", "c becomes 67", "Runtime exception"],
        answer: 1,
        hint: "c + 2 is an int. Java does not implicitly narrow an int back into a char.",
        explanation: "The compiler reports a possible lossy conversion from int to char, so the code does not compile. An explicit cast (char) would be needed."
      },
      {
        question: "What is printed by: printf(\"%d\", 10 % 4);",
        options: ["4", "0", "2", "2.5"],
        answer: 2,
        hint: "% gives the remainder after division.",
        explanation: "10 divided by 4 leaves remainder 2."
      },
      {
        question: "In C, what is printed by: int a = 7; a /= 2; printf(\"%d\", a);",
        options: ["3.5", "4", "7", "3"],
        answer: 3,
        hint: "/= on an int performs integer division.",
        explanation: "7 / 2 is 3 in integer division, so a becomes 3."
      },
      {
        question: "In C, what is printed by: int x = 10; x -= 3 * 2; printf(\"%d\", x);",
        options: ["4", "14", "1", "-4"],
        answer: 0,
        hint: "Multiplication happens before the subtraction assignment.",
        explanation: "3 * 2 = 6, so x becomes 10 - 6 = 4."
      },
      {
        question: "In Java, after int a = 5; boolean b = a > 3 && a < 10; what is the value of b?",
        options: ["false", "true", "5", "Compilation error"],
        answer: 1,
        hint: "Both conditions must be true for && to be true.",
        explanation: "5 > 3 is true and 5 < 10 is true, so b is true."
      },
      {
        question: "In C, what is printed by: for (int i = 10; i > 0; i -= 3) printf(\"%d \", i);",
        options: ["10 7 4", "10 8 6 4 2", "10 7 4 1", "1 4 7 10"],
        answer: 2,
        hint: "Each pass subtracts 3. Stop when i is no longer greater than 0.",
        explanation: "The values are 10, 7, 4 and 1. Then i becomes -2 and the loop ends."
      },
      {
        question: "In C, what is printed by: int i = 0; do { printf(\"%d\", i); } while (i > 0);",
        options: ["Nothing", "Infinite loop", "Compilation error", "0"],
        answer: 3,
        hint: "A do-while loop runs its body once before checking the condition.",
        explanation: "The body runs once and prints 0. The condition 0 > 0 is false, so the loop ends."
      },
      {
        question: "In C, what is printed by: int i = 0; while (i++ < 3); printf(\"%d\", i);",
        options: ["4", "3", "5", "Infinite loop"],
        answer: 0,
        hint: "i++ compares the old value and then increments it.",
        explanation: "The comparison fails when i is 3, but i has already been incremented to 4 before the check ends."
      },
      {
        question: "In Python, after x = 5 and x += 2 * x, what is printed by print(x)?",
        options: ["14", "15", "17", "10"],
        answer: 1,
        hint: "2 * x is evaluated using the current value of x.",
        explanation: "2 * 5 = 10, so x becomes 5 + 10 = 15."
      },
      {
        question: "In Python, after for i in range(3): pass, what is printed by print(i)?",
        options: ["3", "0", "2", "Error"],
        answer: 2,
        hint: "range(3) produces 0, 1 and 2. The loop variable keeps its last value.",
        explanation: "The last value assigned to i is 2."
      },
      {
        question: "In C, what is printed by: int n = 5; printf(\"%d\", n > 3 || n++ > 0); printf(\" %d\", n);",
        options: ["1 6", "0 5", "1 4", "1 5"],
        answer: 3,
        hint: "With ||, the right side is skipped when the left side is already true.",
        explanation: "n > 3 is true, so n++ never runs. The first value is 1 and n stays 5."
      },
      {
        question: "In Java, after int a = 10; a = a++; what is the value of a?",
        options: ["10", "11", "9", "Compilation error"],
        answer: 0,
        hint: "a++ gives the old value, and then the assignment overwrites a with that value.",
        explanation: "a++ yields 10 and increments a to 11, but the assignment then sets a back to 10."
      },
      {
        question: "In C, with char c = 'a';, what is printed by printf(\"%c\", c + 1);?",
        options: ["a", "b", "98", "c"],
        answer: 1,
        hint: "Adding 1 moves to the next character in the alphabet, and %c prints a character.",
        explanation: "'a' + 1 is 98, which is 'b' in ASCII, and %c prints it as a character."
      },
      {
        question: "In C, what is printed by: int a = 3, b = 4; printf(\"%d\", a == b);?",
        options: ["1", "false", "0", "3"],
        answer: 2,
        hint: "== returns 1 for true and 0 for false in C.",
        explanation: "3 is not equal to 4, so the comparison gives 0."
      },
      {
        question: "In Python, what is the result of 10 % -3?",
        options: ["1", "2", "-1", "-2"],
        answer: 3,
        hint: "In Python, the result of % has the same sign as the divisor.",
        explanation: "10 = (-3) * (-4) + (-2), so the result is -2."
      },
      {
        question: "In C, what is printed by: int x = 2; x <<= 3; printf(\"%d\", x);?",
        options: ["16", "6", "8", "32"],
        answer: 0,
        hint: "<<= shifts bits left. Each left shift doubles the value.",
        explanation: "2 shifted left by 3 bits is 2 * 2 * 2 * 2 = 16."
      },
      {
        question: "In C, what is printed by: int total = 0; for (int i = 1; i <= 5; i++) total += i; printf(\"%d\", total);?",
        options: ["10", "15", "12", "5"],
        answer: 1,
        hint: "The loop adds 1 through 5.",
        explanation: "1 + 2 + 3 + 4 + 5 = 15."
      },
      {
        question: "In Java, what is printed by: int x = 0; while (true) { x++; if (x == 4) break; } System.out.println(x);?",
        options: ["3", "5", "4", "Infinite loop"],
        answer: 2,
        hint: "break leaves the loop as soon as x reaches 4.",
        explanation: "x increases to 4, the if statement breaks out of the loop, and 4 is printed."
      },
      {
        question: "In Python, after a, b = 1, 2 and then a, b = b, a, what is printed by print(a, b)?",
        options: ["1 2", "1 1", "2 2", "2 1"],
        answer: 3,
        hint: "The tuple assignment swaps the two values at the same time.",
        explanation: "After the swap, a holds 2 and b holds 1."
      },
      {
        question: "In C, what is printed by: int a = 5; if (a = 0) printf(\"T\"); else printf(\"F\");?",
        options: ["F", "T", "Error", "Nothing"],
        answer: 0,
        hint: "a = 0 is an assignment. Its value is 0, which counts as false.",
        explanation: "a becomes 0, the condition is false, and the else branch prints F."
      },
      {
        question: "In Java, what is printed by System.out.println(5 / 2.0);?",
        options: ["2", "2.5", "2.0", "3"],
        answer: 1,
        hint: "Because 2.0 is a double, the division is not integer division.",
        explanation: "5 divided by 2.0 is 2.5."
      }
  ]
};
