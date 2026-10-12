/* Additional questions appended to each level's existing question bank. */
const EXTRA_LEVEL_QUESTIONS = {
  1: [
    {
      question: "In C, what is the value of 9 / 2 when both operands are integers?",
      options: ["4", "4.5", "5", "Compilation error"],
      hint: "Integer division discards the fractional part.",
      explanation: "With integer operands, 9 / 2 evaluates to 4."
    },
    {
      question: "Which declaration creates a constant integer in C?",
      options: ["int const = 5;", "const int limit = 5;", "constant int limit = 5;", "final int limit = 5;"],
      hint: "The const qualifier appears before the variable name.",
      explanation: "In C, const int limit = 5; declares an integer that should not be modified."
    },
    {
      question: "In Python, what is the result of 3 // 2?",
      options: ["1.5", "2", "1", "0"],
      hint: "The double slash operator performs floor division.",
      explanation: "Floor division rounds the quotient down, so 3 // 2 is 1."
    },
    {
      question: "Which operator checks whether two values are equal in C?",
      options: ["=", "==", "!=", "equals"],
      hint: "It uses two equals signs.",
      explanation: "The == operator compares values; a single = assigns a value."
    },
    {
      question: "How many times does this loop body run? for (int i = 0; i < 5; i++)",
      options: ["4", "6", "5", "Infinite"],
      hint: "The values of i are 0 through 4.",
      explanation: "The loop runs once for each of the five values 0, 1, 2, 3 and 4."
    }
  ],
  2: [
    {
      question: "In C, which value does the expression 0 || 7 evaluate to?",
      options: ["0", "1", "7", "Compilation error"],
      hint: "In C, a logical expression evaluates to 1 when true.",
      explanation: "The second operand is non-zero, so the OR expression is true and evaluates to 1."
    },
    {
      question: "How many times does the inner statement execute? for (i = 1; i <= 3; i++) for (j = 1; j <= 2; j++) count++;",
      options: ["3", "5", "6", "9"],
      hint: "Multiply the number of outer iterations by inner iterations.",
      explanation: "The outer loop runs 3 times and the inner loop runs 2 times each, for 3 * 2 = 6 executions."
    },
    {
      question: "What is printed? int x = 2; if (x > 1 && x < 4) printf(\"yes\"); else printf(\"no\");",
      options: ["yes", "no", "yesno", "Nothing"],
      hint: "Both comparisons must be true.",
      explanation: "2 is greater than 1 and less than 4, so the condition is true and yes is printed."
    },
    {
      question: "Which logical operator is true only when exactly one of its two conditions is true?",
      options: ["AND", "OR", "NOT", "XOR"],
      hint: "Its name means exclusive OR.",
      explanation: "Exclusive OR (XOR) is true when its inputs differ."
    },
    {
      question: "How many stars are printed? for (i = 0; i < 3; i++) for (j = 0; j <= i; j++) printf(\"*\");",
      options: ["3", "6", "9", "4"],
      hint: "The inner loop runs 1, then 2, then 3 times.",
      explanation: "The total is 1 + 2 + 3 = 6 stars."
    }
  ],
  3: [
    {
      question: "In Python, what does len([4, 7, 9, 2]) return?",
      options: ["3", "4", "9", "22"],
      hint: "len returns the number of elements.",
      explanation: "The list contains four elements, so len returns 4."
    },
    {
      question: "In a sorted array, what is the maximum number of elements binary search discards after one comparison?",
      options: ["About half", "One", "All elements", "None"],
      hint: "It keeps only the half that could contain the target.",
      explanation: "Binary search eliminates approximately half of the remaining search range at each step."
    },
    {
      question: "What is the value of a[1] after int a[] = {3, 6, 9};?",
      options: ["3", "9", "6", "1"],
      hint: "Array indexing starts at zero.",
      explanation: "a[0] is 3, so a[1], the second element, is 6."
    },
    {
      question: "Which sorting algorithm repeatedly selects the smallest remaining item and places it next?",
      options: ["Bubble sort", "Selection sort", "Binary search", "Merge sort"],
      hint: "Its name describes choosing an item on each pass.",
      explanation: "Selection sort selects the smallest remaining element on each pass and puts it in its final position."
    },
    {
      question: "In Python, what does \"cat\"[1] evaluate to?",
      options: ["c", "a", "t", "cat"],
      hint: "String indices start at zero.",
      explanation: "Index 1 refers to the second character, which is a."
    }
  ],
  4: [
    {
      question: "In Java, what is the value of 7 / 2 when both operands are int?",
      options: ["3", "3.5", "4", "Compilation error"],
      hint: "Integer division drops the fractional part.",
      explanation: "Both operands are integers, so Java evaluates 7 / 2 as 3."
    },
    {
      question: "In Python, what does 2 ** 4 evaluate to?",
      options: ["8", "16", "6", "24"],
      hint: "The ** operator raises the left operand to a power.",
      explanation: "2 multiplied by itself four times is 16."
    },
    {
      question: "In C, what is printed by printf(\"%d\", 5 > 3);?",
      options: ["true", "5", "1", "3"],
      hint: "C represents true comparisons as 1.",
      explanation: "5 > 3 is true, and C evaluates a true comparison to 1."
    },
    {
      question: "In Java, what does 10 % 4 evaluate to?",
      options: ["2", "2.5", "4", "0"],
      hint: "The remainder operator returns what is left after division.",
      explanation: "10 divided by 4 leaves a remainder of 2."
    },
    {
      question: "In C, what is printed by printf(\"%d\", 2 + 3 * 2);?",
      options: ["10", "8", "12", "7"],
      hint: "Multiplication has higher precedence than addition.",
      explanation: "3 * 2 is evaluated first, then 2 is added, giving 8."
    }
  ],
  5: [
    {
      question: "In a flowchart, what does an arrow between symbols represent?",
      options: ["A decision", "The direction of process flow", "Input data", "The end of the chart"],
      hint: "It connects steps in the order they are followed.",
      explanation: "Arrows show the direction and sequence of control flow."
    },
    {
      question: "What is printed? SET x = 3; SET x = x * 2; PRINT x",
      options: ["3", "5", "6", "9"],
      hint: "Multiply the original value by 2 before printing.",
      explanation: "x is updated to 3 * 2, so the output is 6."
    },
    {
      question: "What is the purpose of pseudocode?",
      options: ["Describe an algorithm in a language-independent way", "Compile a program", "Store program data", "Draw a computer network"],
      hint: "It focuses on the steps, not a programming language's exact syntax.",
      explanation: "Pseudocode describes the logic of an algorithm without requiring the syntax of a particular language."
    },
    {
      question: "What is printed? SET total = 1; FOR i = 1 TO 3: SET total = total * 2; END FOR; PRINT total",
      options: ["4", "6", "8", "3"],
      hint: "Double total once during each of the three iterations.",
      explanation: "Starting at 1, three doublings produce 2, 4, then 8."
    },
    {
      question: "Which flowchart shape represents a predefined process or subroutine?",
      options: ["Oval", "Rectangle with double vertical edges", "Diamond", "Parallelogram"],
      hint: "It resembles a process rectangle with extra vertical lines.",
      explanation: "A predefined process is commonly shown as a rectangle with double vertical edges."
    }
  ],
  6: [
    {
      question: "A program stops with an error while running after it has compiled. What category is this?",
      options: ["Syntax error", "Runtime error", "Formatting warning", "Comment error"],
      hint: "The failure happens during execution.",
      explanation: "A runtime error occurs while a program is executing, such as division by zero."
    },
    {
      question: "What is the first useful step when a bug is reported but cannot be reproduced?",
      options: ["Change random lines", "Gather steps and inputs needed to reproduce it", "Delete the test", "Ignore the report"],
      hint: "You need a repeatable case before diagnosing behavior.",
      explanation: "Recording the exact steps and inputs helps reproduce and isolate the defect."
    },
    {
      question: "What is a regression test intended to verify?",
      options: ["That previously working behavior still works after a change", "That the program has no comments", "That a feature is never changed", "That code has been formatted"],
      hint: "It guards against old defects returning.",
      explanation: "Regression tests check that changes have not broken behavior that previously worked."
    },
    {
      question: "What is the main purpose of a breakpoint?",
      options: ["Pause execution at a chosen location for inspection", "Delete a variable", "Speed up compilation", "Skip every error"],
      hint: "A debugger can stop when execution reaches it.",
      explanation: "A breakpoint pauses execution so the developer can inspect program state."
    },
    {
      question: "A function fails only for an empty list. What is the most relevant test case to add?",
      options: ["A very large non-empty list only", "An empty list", "A random string", "No test is needed"],
      hint: "Tests should cover the boundary that exposed the bug.",
      explanation: "An empty list directly exercises the failing edge case and helps prevent recurrence."
    }
  ],
  7: [
    {
      question: "Which data structure is commonly used to implement breadth-first search?",
      options: ["Stack", "Queue", "Heap", "Hash set"],
      hint: "It processes discovered nodes in first-in, first-out order.",
      explanation: "Breadth-first search uses a queue to visit nodes in discovery order."
    },
    {
      question: "Which operation takes O(1) time in a singly linked list when its head pointer is known?",
      options: ["Searching for the tail", "Inserting a node at the head", "Accessing the middle node by index", "Removing the tail without a previous-node reference"],
      hint: "The operation can update the head and one next pointer directly.",
      explanation: "Inserting at the head only requires linking the new node to the current head and updating the head pointer."
    },
    {
      question: "Which data structure is typically used to track function calls and recursion?",
      options: ["Queue", "Stack", "Graph", "Priority queue"],
      hint: "The most recent call must return first.",
      explanation: "The call stack uses last-in, first-out behavior to manage active function calls."
    },
    {
      question: "In a min-heap, which value is at the root?",
      options: ["The smallest value", "The largest value", "The most recently inserted value", "Any value, with no ordering rule"],
      hint: "Each parent is no greater than its children.",
      explanation: "A min-heap keeps its minimum element at the root."
    },
    {
      question: "What is the average-case lookup time of a well-distributed hash table?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      hint: "A hash function maps a key directly to a bucket on average.",
      explanation: "With a good hash function and controlled collisions, lookup is O(1) on average."
    }
  ],
  8: [
    {
      question: "Which SQL clause sorts query results?",
      options: ["GROUP BY", "ORDER BY", "HAVING", "VALUES"],
      hint: "It can sort ascending or descending.",
      explanation: "ORDER BY sorts the rows returned by a query."
    },
    {
      question: "In Java, which keyword declares a class that cannot be subclassed?",
      options: ["static", "private", "final", "const"],
      hint: "The keyword also prevents a method from being overridden.",
      explanation: "A final class cannot be extended by another class."
    },
    {
      question: "Which HTTP method is conventionally used to retrieve a resource?",
      options: ["GET", "POST", "PATCH", "DELETE"],
      hint: "It should retrieve data without changing server state.",
      explanation: "GET is the standard HTTP method for retrieving a resource."
    },
    {
      question: "What does a primary key identify in a relational database table?",
      options: ["A row uniquely", "A table's display order", "Every nullable column", "A database connection"],
      hint: "Its value must distinguish one row from all others.",
      explanation: "A primary key uniquely identifies each row in a table."
    },
    {
      question: "In Python, what does a function return if it reaches its end without a return statement?",
      options: ["0", "False", "None", "An empty list"],
      hint: "Python uses a special object to represent no returned value.",
      explanation: "A Python function without an explicit return value returns None."
    }
  ],
  9: [
    {
      question: "What is the worst-case time complexity of quicksort with consistently poor pivot choices?",
      options: ["O(n log n)", "O(n²)", "O(log n)", "O(1)"],
      hint: "A highly unbalanced partition can leave almost all items on one side.",
      explanation: "Repeatedly unbalanced partitions lead to O(n²) worst-case time."
    },
    {
      question: "Which graph traversal explores as far as possible along a path before backtracking?",
      options: ["Breadth-first search", "Binary search", "Depth-first search", "Linear search"],
      hint: "It is often implemented with recursion or an explicit stack.",
      explanation: "Depth-first search follows a path deeply before returning to explore alternatives."
    },
    {
      question: "What is the time complexity of merging two already sorted lists with a total of n elements?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      hint: "Each element needs to be considered a constant number of times.",
      explanation: "A merge scans the elements once, so the time is linear in their total count."
    },
    {
      question: "Which algorithmic approach stores answers to overlapping subproblems to avoid recomputing them?",
      options: ["Brute force only", "Dynamic programming", "Randomized search", "Linear probing"],
      hint: "It commonly uses memoization or tabulation.",
      explanation: "Dynamic programming saves subproblem results and reuses them."
    },
    {
      question: "If an algorithm performs about 3n operations, what is its asymptotic time complexity?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      hint: "Ignore constant factors when describing Big O.",
      explanation: "The constant factor 3 is ignored, leaving linear complexity O(n)."
    }
  ],
  10: [
    {
      question: "What is printed? SET x = 3; SET y = x + 4; PRINT y",
      options: ["3", "7", "4", "12"],
      hint: "Assign y the sum of x and 4, then print it.",
      explanation: "x is 3, so y becomes 3 + 4, which is 7."
    },
    {
      question: "How many times does this loop run? FOR i = 2 TO 6 STEP 2: PRINT i; END FOR",
      options: ["2", "3", "4", "5"],
      hint: "List the values beginning at 2 and increasing by 2 up to 6.",
      explanation: "The loop values are 2, 4 and 6, so it runs three times."
    },
    {
      question: "What is printed? SET n = 7; IF n MOD 2 = 0 THEN PRINT \"Even\" ELSE PRINT \"Odd\"",
      options: ["Even", "Odd", "7", "Nothing"],
      hint: "MOD gives the remainder after division by 2.",
      explanation: "7 MOD 2 is 1, so the number is odd."
    },
    {
      question: "What is the value of items[1] for items = [8, 5, 2] using zero-based indexing?",
      options: ["8", "5", "2", "1"],
      hint: "Index 0 refers to the first element.",
      explanation: "Index 1 refers to the second element, which is 5."
    },
    {
      question: "What is printed? SET total = 0; FOR i = 1 TO 4: SET total = total + i; END FOR; PRINT total",
      options: ["4", "6", "10", "24"],
      hint: "Add each loop value to total.",
      explanation: "The total is 1 + 2 + 3 + 4 = 10."
    }
  ]
};

Object.entries(EXTRA_LEVEL_QUESTIONS).forEach(([levelId, questions]) => {
  const level = window.QUEST_LEVELS[Number(levelId)];
  if (level) level.questions.push(...questions);
});
