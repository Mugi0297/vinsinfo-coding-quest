/* Level-specific question bank. Correct answers are kept server-side. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[7] = {
  id: 7,
  title: "DSA Battle",
  icon: "⚔️",
  description: "Data structures and algorithm fundamentals.",
  topics: ["Arrays", "Stacks and queues", "Searching", "Time complexity"],
  questions: [
      {
        question: "Which data structure follows LIFO?",
        options: ["Stack", "Queue", "Graph", "Tree"],
        hint: "The last item inserted is removed first.",
        explanation: "A stack follows Last In, First Out."
      },
      {
        question: "What is the worst-case time complexity of linear search over n elements?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        hint: "It may inspect every element.",
        explanation: "Linear search has worst-case time complexity O(n)."
      },
      {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Tree", "Queue", "Heap"],
        hint: "The first item inserted is removed first.",
        explanation: "A queue follows First In, First Out."
      },
      {
        question: "Starting from an empty stack, you perform push(1), push(2), pop(), push(3). What is the top element now?",
        options: ["1", "2", "The stack is empty", "3"],
        hint: "After pop(), 2 is removed. Then 3 is pushed on top of 1.",
        explanation: "The stack holds 1 and then 3 on top, so the top element is 3."
      },
      {
        question: "A queue receives enqueue(5), enqueue(6), enqueue(7), then dequeue(). What is at the front now?",
        options: ["6", "5", "7", "The queue is empty"],
        hint: "Dequeue removes the oldest element first.",
        explanation: "5 is removed, so 6 is now at the front of the queue."
      },
      {
        question: "Which data structure is the usual choice for checking balanced parentheses such as ( [ ] ) ?",
        options: ["Queue", "Stack", "Heap", "Hash table"],
        hint: "Each closing bracket must match the most recently opened one.",
        explanation: "A stack keeps the most recent opening bracket on top, which makes matching easy."
      },
      {
        question: "What is the time complexity of binary search on a sorted array of n elements?",
        options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
        hint: "Each comparison halves the remaining range.",
        explanation: "Binary search halves the search range each step, giving O(log n)."
      },
      {
        question: "What is the amortized time for appending to the end of a dynamic array (such as ArrayList or Python list)?",
        options: ["O(n) always", "O(log n)", "O(n²)", "O(1) amortized"],
        hint: "Occasional resizing is expensive, but it happens rarely over many appends.",
        explanation: "Most appends are O(1). Resizing costs are spread across many appends, so the amortized cost is O(1)."
      },
      {
        question: "What is the time complexity of two nested loops that each run n times?",
        options: ["O(n²)", "O(n)", "O(2n)", "O(log n)"],
        hint: "The inner body runs n times for each of the n outer iterations.",
        explanation: "The inner body runs n × n times, which is O(n²)."
      },
      {
        question: "What is the worst-case time complexity of quicksort?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        hint: "The worst case happens when every partition is very unbalanced, such as an already sorted input with a poor pivot choice.",
        explanation: "With consistently unbalanced partitions, quicksort performs about n comparisons per level for n levels, giving O(n²)."
      },
      {
        question: "Which data structure does a program use to track function calls?",
        options: ["Queue", "Heap", "Call stack", "Graph"],
        hint: "The most recent call is the first to finish.",
        explanation: "The call stack is a LIFO structure that tracks active function calls."
      },
      {
        question: "A stack built on an array of size 5 starts with top = -1. After 5 pushes, what is top?",
        options: ["5", "-1", "0", "4"],
        hint: "Indices run from 0 to 4 for an array of size 5.",
        explanation: "The fifth push goes to index 4, so top = 4."
      },
      {
        question: "What is it called when you push onto a stack that is already full?",
        options: ["Overflow", "Underflow", "Deadlock", "Fragmentation"],
        hint: "The stack has no room left.",
        explanation: "Pushing onto a full stack is a stack overflow."
      },
      {
        question: "What is it called when you pop from an empty stack?",
        options: ["Overflow", "Underflow", "Overload", "Collision"],
        hint: "There is nothing left to remove.",
        explanation: "Popping from an empty stack is a stack underflow."
      },
      {
        question: "What is the time complexity of push on an array-based stack?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        hint: "Pushing adds one element at the top.",
        explanation: "Pushing writes to the next free index, which takes constant time."
      },
      {
        question: "Which data structure does breadth-first search (BFS) use?",
        options: ["Stack", "Heap", "Trie", "Queue"],
        hint: "BFS visits nodes level by level, so the oldest discovered node should be processed first.",
        explanation: "BFS uses a queue to process nodes in FIFO order."
      },
      {
        question: "Which data structure does an iterative depth-first search (DFS) use?",
        options: ["Stack", "Queue", "Hash table", "Array only"],
        hint: "DFS goes as deep as possible before backtracking.",
        explanation: "An explicit stack gives the last-discovered node priority."
      },
      {
        question: "What is the average time complexity of a lookup in a hash table?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        hint: "A good hash function spreads keys evenly across buckets.",
        explanation: "Average lookups take constant time when collisions are limited."
      },
      {
        question: "For a sorted array of 1,000,000 elements, roughly how many comparisons does binary search need in the worst case?",
        options: ["10", "500000", "20", "1000000"],
        hint: "log₂(1,000,000) is about 20.",
        explanation: "Binary search halves the range each time, so about 20 comparisons are enough."
      },
      {
        question: "What is the worst-case time complexity of bubble sort?",
        options: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
        hint: "Bubble sort uses nested passes over the data.",
        explanation: "Each of n passes can compare up to n elements, giving O(n²)."
      },
      {
        question: "What is the best-case time complexity of insertion sort when the input is already sorted?",
        options: ["O(n)", "O(1)", "O(n log n)", "O(n²)"],
        hint: "Each element needs only one comparison when it is already in place.",
        explanation: "For sorted input, insertion sort makes about n comparisons, giving O(n)."
      },
      {
        question: "What is the space complexity of in-place bubble sort?",
        options: ["O(n)", "O(1)", "O(n²)", "O(log n)"],
        hint: "In-place sorting uses only a fixed number of extra variables.",
        explanation: "Bubble sort swaps inside the array, so the extra space is constant."
      },
      {
        question: "Which sorting algorithm has best-case O(n log n) and worst-case O(n²)?",
        options: ["Merge sort", "Heap sort", "Quicksort", "Insertion sort"],
        hint: "Its performance depends on how the pivot splits the data.",
        explanation: "Quicksort's worst case is O(n²) when pivots are poorly chosen, while merge sort is always O(n log n)."
      },
      {
        question: "What is the worst-case time complexity of heap sort?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
        hint: "Heap sort builds a heap and removes elements one at a time.",
        explanation: "Heap sort is O(n log n) in all cases."
      },
      {
        question: "In a min-heap, where is the smallest element stored?",
        options: ["At the root", "At a leaf", "At the last index always", "It is not stored"],
        hint: "Heap order is enforced from the top down.",
        explanation: "The smallest value is at the root, so it can be read in O(1)."
      },
      {
        question: "What is the time complexity of inserting at the head of a singly linked list?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        hint: "You only need to update the head pointer.",
        explanation: "Inserting at the head takes constant time."
      },
      {
        question: "What is the time complexity of accessing the k-th element of a linked list by position?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        hint: "Linked lists have no direct index.",
        explanation: "You must walk from the head, which takes up to n steps."
      },
      {
        question: "What is a tree called in which each node has at most two children?",
        options: ["Graph", "Queue", "Heap only", "Binary tree"],
        hint: "The name includes the number of children.",
        explanation: "Each node in a binary tree has at most two children."
      },
      {
        question: "Which tree traversal visits the root first, then the left subtree, then the right subtree?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        hint: "The root is visited before its children.",
        explanation: "Preorder visits root, left, right."
      },
      {
        question: "Which traversal of a binary search tree produces its values in sorted order?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        hint: "It visits left, root, right.",
        explanation: "Inorder traversal of a BST visits values in increasing order."
      }
  ]
};
