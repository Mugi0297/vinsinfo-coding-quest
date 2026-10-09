/* Level-specific question bank. answer is a zero-based option index. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[9] = {
  id: 9,
  title: "Final Boss",
  icon: "👑",
  description: "Challenge yourself with mixed concepts.",
  topics: ["Algorithms", "Programming logic", "Complexity", "Problem solving"],
  questions: [
      {
        question: "Which sorting algorithm repeatedly compares adjacent elements?",
        options: ["Bubble sort", "Binary search", "Hashing", "DFS"],
        answer: 0,
        hint: "It is a simple comparison-based sorting algorithm.",
        explanation: "Bubble sort compares adjacent elements and swaps them when needed."
      },
      {
        question: "What is the usual time complexity of accessing an array element by index?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        answer: 1,
        hint: "The index gives direct access.",
        explanation: "Array indexing takes constant time, O(1), under the usual model."
      },
      {
        question: "Which approach breaks a problem into smaller subproblems and combines results?",
        options: ["Random guessing", "Infinite iteration", "Divide and conquer", "Linear scanning only"],
        answer: 2,
        hint: "Merge sort is a familiar example.",
        explanation: "Divide and conquer solves smaller subproblems and combines their results."
      },
      {
        question: "What is the worst-case time complexity of merge sort on n elements?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
        answer: 3,
        hint: "It splits the array about log n times, and each level of merging takes linear work.",
        explanation: "Merge sort always divides in halves and merges in linear time per level, giving O(n log n) in every case."
      },
      {
        question: "A recursive factorial(n) function calls itself n times before returning. What is its auxiliary space complexity due to the call stack?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        answer: 0,
        hint: "Each pending call keeps its own stack frame until the recursion unwinds.",
        explanation: "n nested calls are active at the deepest point, so the call stack uses O(n) space."
      },
      {
        question: "What is the time complexity of computing the n-th Fibonacci number with memoization?",
        options: ["O(2^n)", "O(n)", "O(log n)", "O(1)"],
        answer: 1,
        hint: "Without memoization the same subproblems repeat. With it, each value is computed once.",
        explanation: "Each Fibonacci value from 0 to n is computed once and reused, so the time is O(n)."
      },
      {
        question: "Dijkstra's shortest-path algorithm always extends the nearest unvisited node. Which algorithm design technique does this follow?",
        options: ["Backtracking only", "Random sampling", "Greedy", "Brute force only"],
        answer: 2,
        hint: "It makes the locally best choice at each step.",
        explanation: "Dijkstra's algorithm is greedy: it picks the closest unvisited node at each step, which is correct for non-negative edge weights."
      },
      {
        question: "In a sorted array, you want to find two numbers that add up to a target in O(n) time. Which technique fits best?",
        options: ["Bubble sort pass only", "Recursion only", "Random restart", "Two pointers"],
        answer: 3,
        hint: "Place one pointer at each end and move them inward based on the sum.",
        explanation: "The two-pointer technique scans from both ends in one pass, which gives O(n) time on a sorted array."
      },
      {
        question: "Given f(n) = f(n - 1) + f(n - 2) with f(0) = 0 and f(1) = 1, what is f(6)?",
        options: ["8", "5", "13", "6"],
        answer: 0,
        hint: "Build the sequence 0, 1, 1, 2, 3, 5, 8 step by step.",
        explanation: "The sequence is 0, 1, 1, 2, 3, 5, 8, so f(6) = 8."
      },
      {
        question: "In C, what is the value of 5 & 3 (bitwise AND)?",
        options: ["7", "1", "8", "0"],
        answer: 1,
        hint: "Write 5 as 101 and 3 as 011, then keep only the bits set in both.",
        explanation: "101 AND 011 gives 001, which is 1."
      },
      {
        question: "What is the worst-case time complexity of binary search on n sorted elements?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        answer: 2,
        hint: "The range is halved on each comparison.",
        explanation: "Binary search takes O(log n) comparisons."
      },
      {
        question: "Which of these grows fastest as n becomes large?",
        options: ["O(n²)", "O(2ⁿ)", "O(n log n)", "O(n!)"],
        answer: 3,
        hint: "Factorial growth outpaces exponential growth.",
        explanation: "O(n!) grows faster than O(2ⁿ), which grows faster than O(n²) or O(n log n)."
      },
      {
        question: "Is O(100n) the same complexity class as O(n)?",
        options: ["Yes, constant factors are dropped in Big-O", "No, O(100n) always grows faster", "Only when n is above 100", "Only for sorting algorithms"],
        answer: 0,
        hint: "Big-O describes growth rate, not exact constants.",
        explanation: "Constant factors are ignored, so both are linear."
      },
      {
        question: "What is the time complexity of summing an array with a single loop?",
        options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
        answer: 1,
        hint: "Each element is visited once.",
        explanation: "The loop runs n times, giving O(n)."
      },
      {
        question: "Which technique avoids recomputing overlapping subproblems by storing their results?",
        options: ["Greedy", "Brute force", "Dynamic programming", "Random sampling"],
        answer: 2,
        hint: "It stores answers to smaller subproblems.",
        explanation: "Dynamic programming reuses stored results of overlapping subproblems."
      },
      {
        question: "Which algorithm finds the shortest path in an unweighted graph?",
        options: ["DFS", "Bubble sort", "Prim's algorithm", "BFS"],
        answer: 3,
        hint: "It explores nodes in layers.",
        explanation: "BFS finds shortest paths when every edge has the same weight."
      },
      {
        question: "Kruskal's algorithm is used to find what?",
        options: ["Minimum spanning tree", "Shortest path between two nodes", "Sorted array", "Longest substring"],
        answer: 0,
        hint: "It connects all nodes with the smallest total edge weight.",
        explanation: "Kruskal's algorithm builds a minimum spanning tree."
      },
      {
        question: "Solving N-Queens by placing queens, then undoing choices when a dead end is reached, uses which technique?",
        options: ["Greedy", "Backtracking", "Hashing", "Sliding window"],
        answer: 1,
        hint: "The algorithm tries options and returns to earlier choices.",
        explanation: "Backtracking explores choices and undoes them when they fail."
      },
      {
        question: "Sliding window is commonly used to find what?",
        options: ["The shortest path in a graph", "Sorted strings", "The maximum sum of a fixed-size subarray in O(n)", "The inverse of a matrix"],
        answer: 2,
        hint: "The window moves across the array, updating its sum.",
        explanation: "Sliding window avoids recomputing the full sum each time."
      },
      {
        question: "Which structure gives average O(1) lookup by key?",
        options: ["Linked list", "Binary tree", "Stack", "Hash table"],
        answer: 3,
        hint: "It maps keys to positions using a hash function.",
        explanation: "Hash tables give constant average lookup time."
      },
      {
        question: "What is the purpose of a recursion base case?",
        options: ["To stop the recursion and return a result", "To start the recursion", "To increase speed always", "To allocate memory"],
        answer: 0,
        hint: "Without it, recursion never ends.",
        explanation: "The base case gives the simplest answer and stops further calls."
      },
      {
        question: "Which sorting algorithm is stable (keeps equal elements in their original order)?",
        options: ["Typical quicksort", "Merge sort", "Heap sort", "Selection sort"],
        answer: 1,
        hint: "Stability matters when sorting records by one key.",
        explanation: "Merge sort preserves the relative order of equal elements."
      },
      {
        question: "In C, what is the result of 6 | 3?",
        options: ["3", "9", "7", "5"],
        answer: 2,
        hint: "| sets a bit if it is set in either operand.",
        explanation: "110 OR 011 is 111, which is 7."
      },
      {
        question: "In C, what is the result of 6 ^ 3?",
        options: ["3", "7", "9", "5"],
        answer: 3,
        hint: "^ sets a bit only when the bits differ.",
        explanation: "110 XOR 011 is 101, which is 5."
      },
      {
        question: "In C, what is the result of 3 << 2?",
        options: ["12", "6", "9", "5"],
        answer: 0,
        hint: "Each left shift doubles the value.",
        explanation: "3 shifted left by 2 is 3 * 4 = 12."
      },
      {
        question: "How many distinct subsets does a set of 3 elements have?",
        options: ["3", "8", "6", "9"],
        answer: 1,
        hint: "Each element is either in or out of a subset.",
        explanation: "2³ = 8 subsets."
      },
      {
        question: "How many permutations of 3 distinct items are there?",
        options: ["3", "9", "6", "8"],
        answer: 2,
        hint: "Count the choices for each position.",
        explanation: "3! = 3 × 2 × 1 = 6."
      },
      {
        question: "What is the greatest common divisor of 12 and 18?",
        options: ["2", "3", "12", "6"],
        answer: 3,
        hint: "Find the largest number that divides both.",
        explanation: "6 divides both 12 and 18, and no larger number does."
      },
      {
        question: "How many moves does Tower of Hanoi need for 3 disks?",
        options: ["7", "6", "8", "4"],
        answer: 0,
        hint: "The formula is 2ⁿ - 1.",
        explanation: "2³ - 1 = 7 moves."
      },
      {
        question: "How many edges does a complete graph with 4 nodes have?",
        options: ["4", "6", "8", "12"],
        answer: 1,
        hint: "Every pair of nodes is connected once.",
        explanation: "4 × 3 / 2 = 6 edges."
      }
  ]
};
