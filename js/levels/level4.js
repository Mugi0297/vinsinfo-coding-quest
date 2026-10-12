/* Level-specific question bank. Correct answers are kept server-side. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[4] = {
  id: 4,
  title: "Output Detective",
  icon: "🔍",
  description: "Tricky output questions and operators.",
  topics: ["Operator precedence", "Increment", "Type conversion", "Output tracing"],
  questions: [
      {
        question: "In Java, what does System.out.println(10 / 3); print?",
        options: ["3.33", "4", "3", "Compilation error"],
        hint: "Both operands are integers.",
        explanation: "Integer division produces 3."
      },
      {
        question: "In Python, what is the result of 2 ** 3?",
        options: ["6", "9", "5", "8"],
        hint: "The ** operator means exponentiation.",
        explanation: "2 raised to the power of 3 equals 8."
      },
      {
        question: "In C, what is the value of 7 % 3?",
        options: ["1", "2", "2.33", "0"],
        hint: "The % operator gives the remainder.",
        explanation: "7 divided by 3 leaves a remainder of 1."
      },
      {
        question: "In C, what is printed by: int x = 5; printf(\"%d\", x++ * 2);",
        options: ["12", "10", "11", "Undefined"],
        hint: "x++ gives the current value of x, and the increment takes effect afterwards.",
        explanation: "x++ yields 5, so the product is 10. x becomes 6 after the expression."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", 2 + 3 * 4 - 6 / 2);",
        options: ["7", "15", "11", "9"],
        hint: "Multiplication and division come before addition and subtraction.",
        explanation: "3 * 4 = 12 and 6 / 2 = 3, so 2 + 12 - 3 = 11."
      },
      {
        question: "In Python, what is printed by: print(7 // 2, -7 // 2)?",
        options: ["3 -3", "3.5 -3.5", "3 -3.5", "3 -4"],
        hint: "// is floor division, which rounds toward negative infinity.",
        explanation: "7 // 2 is 3, and -7 // 2 rounds down to -4."
      },
      {
        question: "In Python, what is printed by: print(bool(\"\"), bool(\"0\"))?",
        options: ["False True", "False False", "True True", "True False"],
        hint: "An empty string is falsy. Any non-empty string is truthy, even \"0\".",
        explanation: "The empty string is False, but the non-empty string \"0\" is True."
      },
      {
        question: "In Java, what is printed by: System.out.println(\"5\" + 2 + 3);",
        options: ["10", "523", "55", "Compilation error"],
        hint: "Once a String is involved, + joins text from left to right.",
        explanation: "\"5\" + 2 gives \"52\", then + 3 gives \"523\"."
      },
      {
        question: "In Java, what is printed by: System.out.println(1 + 2 + \"3\" + 4 + 5);",
        options: ["12345", "6345", "3345", "33 9"],
        hint: "1 + 2 is added as numbers first, because it comes before the first String.",
        explanation: "1 + 2 = 3, then \"3\" gives \"33\", \"+ 4\" gives \"334\" and \"+ 5\" gives \"3345\"."
      },
      {
        question: "In C, what is the value of f after: float f = 5 / 2;?",
        options: ["2.5", "3.0", "Compilation error", "2.0"],
        hint: "The division 5 / 2 is done on integers before the result is stored in the float.",
        explanation: "5 / 2 is integer division and gives 2, which is then stored as 2.0."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", 3 > 2 > 1);?",
        options: ["0", "1", "2", "Error"],
        hint: "Comparison operators are evaluated left to right.",
        explanation: "3 > 2 gives 1, and 1 > 1 is false, which gives 0."
      },
      {
        question: "In C, with int a = 2, b = 3;, what is printed by printf(\"%d\", a << 1 + b);?",
        options: ["10", "32", "20", "8"],
        hint: "+ has higher precedence than <<, so the addition happens first.",
        explanation: "1 + b is 4, and 2 << 4 is 32."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", !5 + 3);?",
        options: ["0", "8", "3", "-2"],
        hint: "! is applied before +.",
        explanation: "!5 is 0, and 0 + 3 is 3."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", -7 / 2);?",
        options: ["-4", "3", "-3.5", "-3"],
        hint: "Integer division in C truncates toward zero.",
        explanation: "-7 / 2 is -3.5, and truncating toward zero gives -3."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", -7 % 3);?",
        options: ["-1", "1", "2", "-2"],
        hint: "In C, the sign of the remainder follows the dividend.",
        explanation: "-7 = 3 * (-2) + (-1), so the remainder is -1."
      },
      {
        question: "In C, what is printed by: printf(\"%.2f\", 7 / 2.0);?",
        options: ["3.00", "3.50", "3.5", "3"],
        hint: "%.2f prints exactly two decimal places.",
        explanation: "7 / 2.0 is 3.5, which prints as 3.50."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", 'A' + 1);?",
        options: ["B", "65", "66", "A1"],
        hint: "Character constants are integers in C, and %d prints the number.",
        explanation: "'A' is 65 in ASCII, so 65 + 1 is 66."
      },
      {
        question: "In C, what is printed by: printf(\"%c\", 'A' + 2);?",
        options: ["67", "B", "A2", "C"],
        hint: "Add 2 to the character code, then print it as a character.",
        explanation: "'A' + 2 is 67, and %c prints it as C."
      },
      {
        question: "In Java, what is printed by System.out.println('a' + 'b');?",
        options: ["195", "ab", "98", "Compilation error"],
        hint: "Two chars combined with + are treated as numbers unless a String is involved.",
        explanation: "'a' is 97 and 'b' is 98, so the sum is 195."
      },
      {
        question: "In Java, what is printed by System.out.println(\"\" + 'a' + 'b');?",
        options: ["195", "ab", "97 98", "a b"],
        hint: "The empty String at the start forces string concatenation.",
        explanation: "\"\" + 'a' gives \"a\", then + 'b' gives \"ab\"."
      },
      {
        question: "In Java, after int x = 7; x = x++ + 1;, what is printed by System.out.println(x);?",
        options: ["7", "9", "8", "Compilation error"],
        hint: "x++ gives the old value, but also increments x. The assignment then overwrites x.",
        explanation: "x++ yields 7 and makes x 8. Then 7 + 1 = 8 is assigned to x."
      },
      {
        question: "In Python, what is printed by print(2 ** -1)?",
        options: ["0", "-2", "Error", "0.5"],
        hint: "A negative exponent gives a reciprocal.",
        explanation: "2 ** -1 equals 1 / 2, which is 0.5."
      },
      {
        question: "In Python, what is printed by print(round(2.5), round(3.5))?",
        options: ["2 4", "3 4", "2 3", "3 3"],
        hint: "Python rounds to the nearest even number when a value is exactly halfway.",
        explanation: "round(2.5) is 2 and round(3.5) is 4."
      },
      {
        question: "In Python, what is printed by print(\"ab\" * 3)?",
        options: ["aaa", "ababab", "ab3", "Error"],
        hint: "Multiplying a string by an integer repeats it.",
        explanation: "\"ab\" repeated three times is ababab."
      },
      {
        question: "In Python, what is printed by print(len('hi there'))?",
        options: ["7", "9", "8", "Error"],
        hint: "Spaces count as characters.",
        explanation: "h, i, space, t, h, e, r, e make 8 characters."
      },
      {
        question: "In Python, what is printed by print(0.1 + 0.2 == 0.3)?",
        options: ["True", "Error", "0.3", "False"],
        hint: "Binary floating-point numbers cannot store 0.1 and 0.2 exactly.",
        explanation: "0.1 + 0.2 is about 0.30000000000000004, which is not equal to 0.3."
      },
      {
        question: "In Python, what is printed by print(int(\"12\") + int(3.9))?",
        options: ["15", "123", "12.3", "16"],
        hint: "int() on a float truncates the decimal part.",
        explanation: "int(\"12\") is 12 and int(3.9) is 3, so the sum is 15."
      },
      {
        question: "In Java, what is printed by System.out.println(Integer.MAX_VALUE + 1);?",
        options: ["2147483648", "-2147483648", "0", "Compilation error"],
        hint: "int values wrap around when they overflow.",
        explanation: "Adding 1 to the largest int wraps to the smallest int, -2147483648."
      },
      {
        question: "In Java, what is printed by System.out.println(10 == 10.0);?",
        options: ["false", "Compilation error", "true", "10"],
        hint: "== compares numeric values after promotion.",
        explanation: "10 is promoted to 10.0, so the comparison is true."
      },
      {
        question: "In C, with int a = 4; int b = a-- * 2;, what is printed by printf(\"%d %d\", a, b);?",
        options: ["4 8", "3 4", "4 4", "3 8"],
        hint: "a-- uses the current value of a, then decrements it.",
        explanation: "The expression a-- gives 4 and makes a 3. Then b = 4 * 2 = 8."
      }
  ]
};
