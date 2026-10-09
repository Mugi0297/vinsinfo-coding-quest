/* Level-specific question bank. answer is a zero-based option index. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[2] = {
  id: 2,
  title: "Logic Master",
  icon: "🧠",
  description: "Conditions, nested loops and patterns.",
  topics: ["Nested if", "Logical reasoning", "Nested loops", "Patterns"],
  questions: [
      {
        question: "In C, what is printed when 5 > 2 && 3 < 1 is tested in an if condition?",
        options: ["A if true", "Both branches", "The else branch", "Nothing always"],
        answer: 2,
        hint: "The && operator requires both conditions to be true.",
        explanation: "The second condition is false, so the else branch executes."
      },
      {
        question: "How many times does for (i = 1; i <= 4; i++) run?",
        options: ["3", "5", "Infinite", "4"],
        answer: 3,
        hint: "Count the values 1, 2, 3 and 4.",
        explanation: "The loop executes four times."
      },
      {
        question: "Which statement selects among multiple constant cases?",
        options: ["switch", "while", "continue", "return only"],
        answer: 0,
        hint: "It uses case labels.",
        explanation: "A switch statement selects among multiple cases."
      },
      {
        question: "In C, how many times is count incremented? for (i = 1; i <= 3; i++) for (j = 1; j <= i; j++) count++;",
        options: ["3", "6", "9", "4"],
        answer: 1,
        hint: "The inner loop runs 1, 2 and 3 times for the three outer iterations.",
        explanation: "The inner loop runs 1 + 2 + 3 = 6 times in total."
      },
      {
        question: "In C, what is printed by: int x = 4; if (x % 2 == 0) if (x > 10) printf(\"A\"); else printf(\"B\");",
        options: ["A", "AB", "B", "Nothing"],
        answer: 2,
        hint: "An else belongs to the nearest unmatched if.",
        explanation: "The else binds to the inner if (x > 10). That condition is false, so B is printed."
      },
      {
        question: "In C, what is printed by: int a = 0, b = 5; if (a != 0 && 10 / a > 1) printf(\"X\"); else printf(\"Y\");",
        options: ["X", "Division by zero error", "Nothing", "Y"],
        answer: 3,
        hint: "Look at what && does when its left side is false.",
        explanation: "a != 0 is false, so && short-circuits and never evaluates 10 / a. The else branch prints Y."
      },
      {
        question: "This code prints a pattern: for (i = 1; i <= 3; i++) { for (j = 1; j <= i; j++) printf(\"*\"); printf(\"\\n\"); }. How many stars are printed in total?",
        options: ["6", "3", "9", "12"],
        answer: 0,
        hint: "Add the stars on each line: 1, 2 and 3.",
        explanation: "The lines contain 1, 2 and 3 stars, so the total is 6."
      },
      {
        question: "In C, what is printed by: int n = 2; switch (n) { case 1: printf(\"a\"); case 2: printf(\"b\"); case 3: printf(\"c\"); break; default: printf(\"d\"); }",
        options: ["b", "bc", "bcd", "c"],
        answer: 1,
        hint: "Without a break, execution falls through into the next case.",
        explanation: "Case 2 matches and prints b. There is no break, so execution falls into case 3 and prints c, then break stops it."
      },
      {
        question: "With a = 3 and b = 1, what does !(a > 5 || b < 2) evaluate to?",
        options: ["true", "1", "false", "Error"],
        answer: 2,
        hint: "Evaluate the inside of the parentheses first, then apply the NOT.",
        explanation: "a > 5 is false and b < 2 is true, so the OR is true. NOT true is false."
      },
      {
        question: "What is the total number of statements executed when a nested loop runs its outer loop 4 times and its inner loop 3 times on each pass?",
        options: ["7", "3", "4", "12"],
        answer: 3,
        hint: "Multiply the number of outer iterations by the inner iterations per pass.",
        explanation: "4 outer iterations times 3 inner iterations each gives 12 runs of the inner body."
      },
      {
        question: "In C, with x = 15, which output does this code print? if (x % 3 == 0 && x % 5 == 0) printf(\"FizzBuzz\"); else if (x % 3 == 0) printf(\"Fizz\");",
        options: ["FizzBuzz", "Fizz", "Buzz", "Nothing"],
        answer: 0,
        hint: "15 is divisible by both 3 and 5, so check the first condition.",
        explanation: "Both remainders are 0, so the first branch runs and prints FizzBuzz."
      },
      {
        question: "In C, how many times is count incremented? for (i = 1; i <= 3; i++) for (j = 3; j >= i; j--) count++;",
        options: ["3", "6", "9", "4"],
        answer: 1,
        hint: "For each value of i, count how many values of j satisfy j >= i.",
        explanation: "i = 1 gives 3 runs, i = 2 gives 2, and i = 3 gives 1. The total is 6."
      },
      {
        question: "In C, the code below prints X when i equals j and O otherwise. for (i = 1; i <= 3; i++) for (j = 1; j <= 3; j++) if (i == j) printf(\"X\"); else printf(\"O\"); How many X characters are printed?",
        options: ["6", "9", "3", "0"],
        answer: 2,
        hint: "Only the diagonal cells in a 3 by 3 grid have equal row and column numbers.",
        explanation: "The pairs (1,1), (2,2) and (3,3) match, so 3 X characters are printed."
      },
      {
        question: "In C, what is printed by: int i; for (i = 0; i < 10; i += 4); printf(\"%d\", i);?",
        options: ["8", "10", "4", "12"],
        answer: 3,
        hint: "The semicolon after the for loop makes the loop body empty.",
        explanation: "i goes 0, 4, 8, 12. At 12 the condition 12 < 10 is false, so 12 is printed."
      },
      {
        question: "In C, with a = 1 and b = 2, what is printed by: if (a > b) printf(\"1\"); else if (a == 1) printf(\"2\"); else printf(\"3\");?",
        options: ["2", "1", "3", "None"],
        answer: 0,
        hint: "Check the conditions in order and stop at the first true one.",
        explanation: "a > b is false, but a == 1 is true, so 2 is printed."
      },
      {
        question: "In C, what is printed by: int k = 0; while (k < 3) { k++; if (k == 2) continue; printf(\"%d\", k); }?",
        options: ["123", "13", "12", "3"],
        answer: 1,
        hint: "continue skips the rest of the loop body for this pass only.",
        explanation: "k = 1 prints 1. k = 2 skips the print. k = 3 prints 3."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", !0 && 1 || 0);?",
        options: ["0", "2", "1", "Error"],
        answer: 2,
        hint: "Work out !0 first. Then use the && before the ||.",
        explanation: "!0 is 1, so (1 && 1) || 0 is 1."
      },
      {
        question: "In C, with x = 3, what is printed by: printf(\"%d\", x > 2 ? x < 5 ? 1 : 2 : 3);?",
        options: ["2", "3", "0", "1"],
        answer: 3,
        hint: "The conditional operator is right-associative, so the nested one works on the middle part.",
        explanation: "x > 2 is true, then x < 5 is true, so the result is 1."
      },
      {
        question: "In C, with n = 12, what is printed by: if (n > 0) { if (n % 4 == 0) printf(\"A\"); if (n % 3 == 0) printf(\"B\"); }?",
        options: ["AB", "A", "B", "None"],
        answer: 0,
        hint: "Each if statement is checked separately, so both can print.",
        explanation: "12 is divisible by 4 and by 3, so A and then B are printed."
      },
      {
        question: "In C, the code below prints a 4 by 4 grid where * marks cells with column j <= row i and . marks the others. for (i = 1; i <= 4; i++) { for (j = 1; j <= 4; j++) printf(j <= i ? \"*\" : \".\"); printf(\"\\n\"); } How many '.' characters are printed in total?",
        options: ["10", "6", "4", "16"],
        answer: 1,
        hint: "Count the stars first. Subtract them from the total number of cells, which is 16.",
        explanation: "The stars are 1 + 2 + 3 + 4 = 10, so the dots are 16 - 10 = 6."
      },
      {
        question: "In C, what is printed by: for (i = 1; i <= 3; i++) { for (j = 1; j <= i; j++) printf(\"%d\", j); }?",
        options: ["123", "111213", "112123", "123123"],
        answer: 2,
        hint: "Each row prints numbers from 1 up to the row number.",
        explanation: "Row 1 prints 1, row 2 prints 12 and row 3 prints 123, giving 112123."
      },
      {
        question: "In C, with d = 9, what is printed by: switch (d) { case 1: printf(\"one\"); break; default: printf(\"other\"); }?",
        options: ["one", "nothing", "error", "other"],
        answer: 3,
        hint: "If no case matches, the default branch runs.",
        explanation: "9 does not match case 1, so the default branch prints other."
      },
      {
        question: "In C, with g = 'B', what is printed by: switch (g) { case 'A': printf(\"4\"); break; case 'B': printf(\"3\"); case 'C': printf(\"2\"); break; }?",
        options: ["32", "3", "2", "4"],
        answer: 0,
        hint: "Without break, execution continues into the next case.",
        explanation: "case 'B' prints 3. There is no break, so case 'C' also prints 2, then break stops it."
      },
      {
        question: "How many of the four (p, q) truth combinations make p AND NOT q true?",
        options: ["0", "1", "2", "4"],
        answer: 1,
        hint: "Check each pair. You need p to be true and q to be false.",
        explanation: "Only (true, false) works, so the answer is 1."
      },
      {
        question: "In C, how many times does the body run for: for (i = 10; i >= 1; i /= 2)?",
        options: ["3", "5", "4", "Infinite loop"],
        answer: 2,
        hint: "Write out the values of i after each pass.",
        explanation: "i takes the values 10, 5, 2 and 1. After 1, i becomes 0 and the loop stops, so there are 4 passes."
      },
      {
        question: "In C, what is printed by: int i = 1; while (i < 100) i *= 3; printf(\"%d\", i);?",
        options: ["81", "100", "27", "243"],
        answer: 3,
        hint: "Multiply by 3 until i is no longer less than 100.",
        explanation: "i takes 1, 3, 9, 27, 81 and 243. At 243 the condition is false."
      },
      {
        question: "A pyramid of height 4 has rows with 3, 2, 1 and 0 leading spaces. How many leading spaces are there in total?",
        options: ["6", "4", "10", "12"],
        answer: 0,
        hint: "Add the spaces row by row.",
        explanation: "3 + 2 + 1 + 0 = 6."
      },
      {
        question: "In C, what is printed by: printf(\"%d\", 1 + 2 == 3 && 4 > 5 || 1);?",
        options: ["0", "1", "2", "Error"],
        answer: 1,
        hint: "Evaluate comparisons first, then &&, then ||.",
        explanation: "The left part is 1 && 0, which is 0. Then 0 || 1 is 1."
      },
      {
        question: "In C, what is printed by: for (i = 0; i < 3; i++) { for (j = 0; j < 3; j++) { if (j == 1) break; printf(\"%d%d \", i, j); } }?",
        options: ["00 01 02", "00 01 10 11 20 21", "00 10 20", "00 10 20 01"],
        answer: 2,
        hint: "break only leaves the inner loop, and it runs when j becomes 1.",
        explanation: "For each i, the inner loop prints only j = 0 before breaking, giving 00 10 20."
      },
      {
        question: "In Java, what is printed by: int x = 6; if (x > 3) System.out.print(\"A\"); if (x > 5) System.out.print(\"B\"); else System.out.print(\"C\");?",
        options: ["A", "AC", "ABC", "AB"],
        answer: 3,
        hint: "The two if statements are separate, so both are checked.",
        explanation: "The first if prints A. The second condition 6 > 5 is true, so B is printed and C is skipped."
      }
  ]
};
