/* Level-specific question bank. answer is a zero-based option index. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[10] = {
  id: 10,
  title: "Pseudocode Practice",
  icon: "📝",
  description: "30 placement-round practice questions on tracing and reasoning about algorithms.",
  topics: ["Pseudocode conventions", "Variables and assignment", "Conditions", "Loops", "Arrays"],
  questions: [
    {
      question: "What is the value of total after this pseudocode? SET total = 4; SET total = total * 3",
      options: ["7", "12", "4", "3"],
      answer: 1,
      hint: "The second statement multiplies the current value of total by 3.",
      explanation: "total starts at 4, then becomes 4 * 3, which is 12."
    },
    {
      question: "What does this pseudocode output? SET x = 8; IF x > 5 THEN PRINT \"Large\" ELSE PRINT \"Small\"",
      options: ["Small", "8", "Large", "Nothing"],
      answer: 2,
      hint: "Evaluate the condition before choosing a branch.",
      explanation: "8 is greater than 5, so the IF branch prints Large."
    },
    {
      question: "How many times does this loop run? FOR i = 1 TO 5: PRINT i; END FOR",
      options: ["4", "5", "6", "1"],
      answer: 1,
      hint: "In this pseudocode, FOR includes both the start and end values.",
      explanation: "The loop takes the values 1, 2, 3, 4 and 5, so it runs five times."
    },
    {
      question: "What is printed? SET sum = 0; FOR n = 2 TO 4: SET sum = sum + n; END FOR; PRINT sum",
      options: ["9", "6", "7", "24"],
      answer: 0,
      hint: "Add each loop value, including both endpoints, to sum.",
      explanation: "The loop adds 2 + 3 + 4, so sum is 9."
    },
    {
      question: "What is the final value of count? SET count = 0; WHILE count < 3: SET count = count + 1; END WHILE",
      options: ["2", "3", "4", "0"],
      answer: 1,
      hint: "The loop stops as soon as count is no longer less than 3.",
      explanation: "count increases from 0 to 1, 2, then 3. At 3 the condition is false."
    },
    {
      question: "What is output by this pseudocode? SET value = 10; IF value MOD 2 = 0 THEN PRINT \"Even\" ELSE PRINT \"Odd\"",
      options: ["10", "Odd", "Even", "Error"],
      answer: 2,
      hint: "MOD gives the remainder after division.",
      explanation: "10 MOD 2 is 0, so value is even and the pseudocode prints Even."
    },
    {
      question: "An array uses zero-based indexing. What is the value of items[2] for items = [6, 9, 12, 15]?",
      options: ["9", "12", "6", "15"],
      answer: 1,
      hint: "Index 0 is the first item.",
      explanation: "With zero-based indexing, index 2 refers to the third item, 12."
    },
    {
      question: "What is printed? SET x = 3; SET y = 7; SET x = y; SET y = x + 2; PRINT x, y",
      options: ["3, 5", "7, 9", "7, 5", "3, 9"],
      answer: 1,
      hint: "After x = y, both variables have the value 7.",
      explanation: "x becomes 7. Then y becomes x + 2, or 9. The output is 7, 9."
    },
    {
      question: "What is the purpose of a procedure in pseudocode?",
      options: ["To group reusable steps under a name", "To store one number only", "To end every loop", "To compare two arrays automatically"],
      answer: 0,
      hint: "Think of a named block of instructions that can be called when needed.",
      explanation: "A procedure groups instructions into a reusable named block."
    },
    {
      question: "What is printed? SET result = 1; FOR i = 1 TO 4: SET result = result * 2; END FOR; PRINT result",
      options: ["8", "4", "16", "2"],
      answer: 2,
      hint: "Double result once on each of the four iterations.",
      explanation: "result changes 1 → 2 → 4 → 8 → 16, so the output is 16."
    },
    {
      question: "Which structure is best for choosing between different actions based on a condition?",
      options: ["Sequence", "Selection (IF/ELSE)", "Iteration", "Assignment"],
      answer: 1,
      hint: "It allows a program to take one path or another.",
      explanation: "Selection uses IF/ELSE conditions to choose which instructions run."
    },
    {
      question: "What is printed? SET n = 5; WHILE n > 1: PRINT n; SET n = n - 2; END WHILE",
      options: ["5, 3", "5, 3, 1", "4, 2", "5, 4, 3, 2"],
      answer: 0,
      hint: "The condition is checked before each iteration.",
      explanation: "The loop prints 5 and then 3. After n becomes 1, n > 1 is false and the loop ends."
    },
    {
      question: "What is the final value of total? SET total = 0; FOR i = 1 TO 3: FOR j = 1 TO i: SET total = total + j; END FOR; END FOR",
      options: ["6", "9", "10", "14"],
      answer: 2,
      hint: "The inner loop adds 1, then 1 + 2, then 1 + 2 + 3.",
      explanation: "The three inner-loop totals are 1, 3 and 6. Their sum is 10."
    },
    {
      question: "A uses zero-based indexing. After this runs, what is A[1]? SET A = [2, 4, 6, 8, 10]; SET left = 0; SET right = 4; WHILE left < right: SWAP A[left], A[right]; SET left = left + 1; SET right = right - 1; END WHILE",
      options: ["4", "8", "6", "10"],
      answer: 1,
      hint: "The algorithm swaps matching positions from the two ends, moving inward.",
      explanation: "The array is reversed to [10, 8, 6, 4, 2], so A[1] is 8."
    },
    {
      question: "What does mystery(5) return? FUNCTION mystery(n): IF n <= 1 THEN RETURN 1; ELSE RETURN n + mystery(n - 2); END IF; END FUNCTION",
      options: ["8", "9", "10", "11"],
      answer: 1,
      hint: "Expand the calls until the base case: mystery(5) calls mystery(3), which calls mystery(1).",
      explanation: "mystery(5) = 5 + mystery(3) = 5 + 3 + mystery(1) = 5 + 3 + 1 = 9."
    },
    {
      question: "Binary search checks the middle item first and uses floor((low + high) / 2). How many items are checked to find 23 in [3, 8, 12, 17, 23, 31, 42], using indices 0 through 6?",
      options: ["2", "3", "4", "5"],
      answer: 1,
      hint: "The middle values checked are 17, then 31, then 23.",
      explanation: "It checks index 3 (17), then index 5 (31), then index 4 (23): three items."
    },
    {
      question: "What does F(3) return? FUNCTION F(n): IF n = 0 THEN RETURN 0; ELSE RETURN 2 * F(n - 1) + 1; END IF; END FUNCTION",
      options: ["3", "5", "7", "8"],
      answer: 2,
      hint: "Work upward from F(0) = 0.",
      explanation: "F(1) = 1, F(2) = 3 and F(3) = 7."
    },
    {
      question: "How many times does count increase? SET count = 0; FOR i = 1 TO 4: FOR j = i TO 4: SET count = count + 1; END FOR; END FOR",
      options: ["8", "9", "10", "16"],
      answer: 2,
      hint: "The inner loop runs 4, 3, 2 and 1 times for successive values of i.",
      explanation: "The total is 4 + 3 + 2 + 1 = 10 increments."
    },
    {
      question: "What is printed? SET A = [[2, 1, 4], [3, 5, 0], [7, 6, 8]]; SET sum = 0; FOR i = 0 TO 2: SET sum = sum + A[i][i]; END FOR; PRINT sum",
      options: ["13", "15", "18", "20"],
      answer: 1,
      hint: "The loop adds the main diagonal entries.",
      explanation: "The diagonal entries are 2, 5 and 8. Their sum is 15."
    },
    {
      question: "One pass of ascending selection sort finds the smallest value in [7, 4, 9, 2] and swaps it with the first value. What is at index 2 afterward?",
      options: ["2", "4", "7", "9"],
      answer: 3,
      hint: "After the swap, the array is [2, 4, 9, 7].",
      explanation: "The minimum 2 swaps with 7, giving [2, 4, 9, 7]. Index 2 contains 9."
    },
    {
      question: "What is printed? SET a = 4; SET b = 9; IF (a * 2 < b) AND (b MOD a = 1) THEN PRINT a + b; ELSE PRINT a - b",
      options: ["-5", "5", "13", "False"],
      answer: 2,
      hint: "Check both parts: 8 < 9, and 9 MOD 4 equals 1.",
      explanation: "Both conditions are true, so the output is a + b = 13."
    },
    {
      question: "What does factorial(4) return? FUNCTION factorial(n): IF n <= 1 THEN RETURN 1; ELSE RETURN n * factorial(n - 1); END IF; END FUNCTION",
      options: ["10", "16", "24", "120"],
      answer: 2,
      hint: "Expand it as 4 * 3 * 2 * factorial(1).",
      explanation: "factorial(4) = 4 * 3 * 2 * 1 = 24."
    },
    {
      question: "How many times is count increased? SET A = [4, 2, 4, 4, 1, 4]; SET count = 0; FOR i = 0 TO 5: IF A[i] = 4 THEN SET count = count + 1; END IF; END FOR",
      options: ["3", "4", "5", "6"],
      answer: 1,
      hint: "Count the array entries equal to 4.",
      explanation: "There are four occurrences of 4, so count becomes 4."
    },
    {
      question: "How many times does this loop run? SET n = 81; SET count = 0; WHILE n > 1: SET n = FLOOR(n / 3); SET count = count + 1; END WHILE",
      options: ["3", "4", "5", "8"],
      answer: 1,
      hint: "Track n after each division: 81, 27, 9, 3, 1.",
      explanation: "The loop runs for 81, 27, 9 and 3, stopping when n becomes 1: four iterations."
    },
    {
      question: "What is A[3] after this loop? A uses zero-based indexing. SET A = [3, 1, 4, 1, 5]; FOR i = 1 TO 4: SET A[i] = A[i] + A[i - 1]; END FOR",
      options: ["5", "8", "9", "14"],
      answer: 2,
      hint: "The array is updated from left to right, so each step uses the already-updated previous item.",
      explanation: "A becomes [3, 4, 8, 9, 14] as the loop progresses. A[3] is 9."
    },
    {
      question: "What is the final value of largest? SET A = [13, 6, 18, 11]; SET largest = A[0]; FOR i = 1 TO 3: IF A[i] > largest THEN SET largest = A[i]; END IF; END FOR",
      options: ["6", "11", "13", "18"],
      answer: 3,
      hint: "Compare each next item with the current largest value.",
      explanation: "largest changes from 13 to 18 and stays 18 for the remaining items."
    },
    {
      question: "What is printed? SET total = 0; FOR i = 1 TO 4: SET total = total + i * i; END FOR; PRINT total",
      options: ["20", "30", "36", "40"],
      answer: 1,
      hint: "Add the squares 1, 4, 9 and 16.",
      explanation: "1² + 2² + 3² + 4² = 1 + 4 + 9 + 16 = 30."
    },
    {
      question: "What does gcd(48, 18) return? FUNCTION gcd(a, b): WHILE b != 0: SET temp = b; SET b = a MOD b; SET a = temp; END WHILE; RETURN a; END FUNCTION",
      options: ["3", "6", "9", "12"],
      answer: 1,
      hint: "The remainders progress through 48 MOD 18 = 12, 18 MOD 12 = 6, and 12 MOD 6 = 0.",
      explanation: "The Euclidean algorithm ends with a = 6 and b = 0, so the greatest common divisor is 6."
    },
    {
      question: "What does reverseDigits(3402) return? FUNCTION reverseDigits(n): SET result = 0; WHILE n > 0: SET result = result * 10 + (n MOD 10); SET n = FLOOR(n / 10); END WHILE; RETURN result; END FUNCTION",
      options: ["2043", "2403", "3042", "20430"],
      answer: 0,
      hint: "Take the last digit each time and append it to result.",
      explanation: "The digits are processed as 2, 0, 4, 3, producing 2043."
    },
    {
      question: "What is total after the loop? SET total = 0; FOR i = 1 TO 5: IF i MOD 2 = 0 THEN SET total = total + i * i; END IF; END FOR",
      options: ["10", "16", "20", "30"],
      answer: 2,
      hint: "Only even i values contribute to total.",
      explanation: "The even values are 2 and 4, so total is 2² + 4² = 4 + 16 = 20."
    }
  ]
};
