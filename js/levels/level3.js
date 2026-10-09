/* Level-specific question bank. answer is a zero-based option index. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[3] = {
  id: 3,
  title: "Array Hunter",
  icon: "🎯",
  description: "Arrays, strings, searching and sorting.",
  topics: ["Arrays", "Strings", "Searching", "Sorting"],
  questions: [
      {
        question: "In C, what is the index of the first array element?",
        options: ["0", "1", "-1", "It depends on values"],
        answer: 0,
        hint: "C uses zero-based indexing.",
        explanation: "The first element of a C array has index 0."
      },
      {
        question: "Which standard search algorithm requires sorted data?",
        options: ["Linear search", "Binary search", "Sequential scan", "None"],
        answer: 1,
        hint: "It repeatedly halves the search range.",
        explanation: "Binary search relies on sorted data."
      },
      {
        question: "What is the last valid index of an array of length n?",
        options: ["n", "n + 1", "n - 1", "1"],
        answer: 2,
        hint: "The first index is zero.",
        explanation: "The last valid index is n - 1."
      },
      {
        question: "In C, what is printed by: int a[] = {4, 8, 15, 16, 23, 42}; printf(\"%d\", a[2] + a[4]);",
        options: ["35", "42", "39", "38"],
        answer: 3,
        hint: "Count the indices from zero: a[2] is 15 and a[4] is 23.",
        explanation: "a[2] = 15 and a[4] = 23, so the sum is 38."
      },
      {
        question: "In C, what is the value of a[4] after: int a[5] = {1, 2};",
        options: ["0", "Garbage value always", "2", "Compilation error"],
        answer: 0,
        hint: "Elements that are not explicitly initialized are set to zero.",
        explanation: "C zero-initializes the remaining elements of a partially initialized array."
      },
      {
        question: "In C, what does sizeof(s) return for char s[] = \"HELLO\"; on a typical system?",
        options: ["5", "6", "4", "Undefined"],
        answer: 1,
        hint: "A C string literal ends with an extra null character, '\\0'.",
        explanation: "Five letters plus the terminating '\\0' make 6 bytes, and sizeof counts the whole array."
      },
      {
        question: "In binary search on the sorted array {2, 5, 8, 12, 16, 23, 38}, which element is checked first?",
        options: ["8", "16", "12", "23"],
        answer: 2,
        hint: "With indices 0 to 6, the first middle index is (0 + 6) / 2 = 3.",
        explanation: "The middle index is 3, and the element at index 3 is 12."
      },
      {
        question: "After one complete ascending bubble sort pass over {5, 1, 4, 2, 8}, what is the array?",
        options: ["1 2 4 5 8", "1 4 5 2 8", "5 1 4 2 8", "1 4 2 5 8"],
        answer: 3,
        hint: "Each pass carries the largest seen so far toward the end. Trace each adjacent swap.",
        explanation: "The swaps are 5 with 1, then 5 with 4, then 5 with 2. The result is 1 4 2 5 8."
      },
      {
        question: "What is the sign of strcmp(\"apple\", \"apricot\") in C?",
        options: ["Negative", "Positive", "Zero", "Undefined"],
        answer: 0,
        hint: "The strings match up to index 1. Compare the characters at index 2.",
        explanation: "At index 2, 'p' (112) comes before 'r' (114), so strcmp returns a negative value."
      },
      {
        question: "In C, what is printed by: int m[2][3] = {{1, 2, 3}, {4, 5, 6}}; printf(\"%d\", m[1][2]);",
        options: ["3", "6", "5", "4"],
        answer: 1,
        hint: "m[1] is the second row. Index 2 inside it is the third column.",
        explanation: "m[1][2] is the third element of the second row, which is 6."
      },
      {
        question: "In C, with int a[] = {3, 1, 4, 1, 5};, what does sizeof(a) / sizeof(a[0]) give?",
        options: ["4", "20", "5", "1"],
        answer: 2,
        hint: "sizeof(a) is the total byte size, and sizeof(a[0]) is the size of one element.",
        explanation: "The array has 5 elements, so the result is 5."
      },
      {
        question: "In C, with int a[3][2] = {{1, 2}, {3, 4}, {5, 6}};, what is a[2][0] * a[0][1]?",
        options: ["6", "12", "5", "10"],
        answer: 3,
        hint: "Row 2 is the third row. Column 0 is its first column. Row 0, column 1 is the second column of the first row.",
        explanation: "a[2][0] is 5 and a[0][1] is 2, so the product is 10."
      },
      {
        question: "In the array {7, 3, 9, 3, 5}, what is the index of the first occurrence of 3?",
        options: ["1", "3", "0", "4"],
        answer: 0,
        hint: "Scan from the left and stop at the first match.",
        explanation: "The first 3 is at index 1, the second is at index 3."
      },
      {
        question: "How many times does the value 3 appear in the array {7, 3, 9, 3, 5}?",
        options: ["1", "2", "3", "0"],
        answer: 1,
        hint: "Count each matching element.",
        explanation: "3 appears at indices 1 and 3, so it appears 2 times."
      },
      {
        question: "After the first pass of selection sort on {64, 25, 12, 22, 11}, what is the array?",
        options: ["11 64 25 12 22", "12 25 64 22 11", "11 25 12 22 64", "64 25 12 22 11"],
        answer: 2,
        hint: "Find the smallest element and swap it with the first position.",
        explanation: "The smallest value is 11. Swapping it with 64 gives 11 25 12 22 64."
      },
      {
        question: "After insertion sort handles the first two elements of {5, 2, 8}, what is the array?",
        options: ["5 2 8", "2 8 5", "5 8 2", "2 5 8"],
        answer: 3,
        hint: "Insertion sort places each new element into the sorted part on its left.",
        explanation: "2 is inserted before 5, so the first two elements become 2 and 5. The 8 is unchanged."
      },
      {
        question: "In C, with char s[] = \"abc\";, what is s[strlen(s) - 1]?",
        options: ["c", "a", "b", "Null character"],
        answer: 0,
        hint: "strlen gives 3. Remember that indices start at 0.",
        explanation: "strlen(s) is 3, so the index is 2, which holds c."
      },
      {
        question: "In C, with int a[] = {2, 4, 6}; int *p = a;, what is *(p + 2)?",
        options: ["2", "6", "4", "Garbage value"],
        answer: 1,
        hint: "p + 2 moves the pointer two elements forward.",
        explanation: "p points to a[0], so p + 2 points to a[2], which holds 6."
      },
      {
        question: "In binary search on the sorted array {1, 3, 5, 7, 9, 11}, looking for 9, how many middle elements are checked?",
        options: ["1", "3", "2", "4"],
        answer: 2,
        hint: "Check the middle, then narrow the range to the right half.",
        explanation: "The first middle is 5, which is too small. The next middle is 9, so the search finishes after 2 checks."
      },
      {
        question: "What is the maximum value in the array {-3, -8, -1}?",
        options: ["-8", "0", "-3", "-1"],
        answer: 3,
        hint: "Negative numbers are compared the same way as positive numbers, with larger meaning closer to zero.",
        explanation: "-1 is greater than -3 and -8, so it is the maximum."
      },
      {
        question: "After reversing the array {1, 2, 3, 4, 5} in place with two pointers, what is the value at index 1?",
        options: ["4", "2", "3", "5"],
        answer: 0,
        hint: "Swap the element at index i with the element at index n - 1 - i.",
        explanation: "After reversal the array is 5 4 3 2 1, so index 1 holds 4."
      },
      {
        question: "In C, what is the result of declaring int a[4]; and then writing a[4] = 9;?",
        options: ["It is valid and sets a[0] to 9", "It writes out of bounds, which causes undefined behavior", "It resizes the array to hold five values", "It sets all elements to 9"],
        answer: 1,
        hint: "Valid indices for an array of size 4 are 0 to 3.",
        explanation: "Index 4 is outside the array, so writing to it causes undefined behavior."
      },
      {
        question: "In C, what is strlen(\"C Prog\")?",
        options: ["5", "7", "6", "0"],
        answer: 2,
        hint: "Count every character, including the space.",
        explanation: "The characters are C, space, P, r, o and g, which makes 6."
      },
      {
        question: "In Java, what is printed by: String s = \"Java\"; System.out.println(s.charAt(1));?",
        options: ["J", "v", "2", "a"],
        answer: 3,
        hint: "charAt uses zero-based indexing.",
        explanation: "Index 0 is J and index 1 is a."
      },
      {
        question: "In Java, what is printed by: String s = \"hello\"; System.out.println(s.substring(1, 4));?",
        options: ["ell", "hel", "ello", "hell"],
        answer: 0,
        hint: "substring includes the start index and excludes the end index.",
        explanation: "Indices 1, 2 and 3 hold e, l and l, which gives ell."
      },
      {
        question: "In Java, what is printed by: int[] arr = {1, 2, 3}; System.out.println(arr.length);?",
        options: ["2", "3", "4", "Compilation error"],
        answer: 1,
        hint: "length counts elements, not indices.",
        explanation: "The array has three elements, so length is 3."
      },
      {
        question: "In Python, what is printed by: a = [0, 1, 2, 3, 4, 5]; print(a[1:4])?",
        options: ["[1, 2, 3, 4]", "[0, 1, 2, 3]", "[1, 2, 3]", "[2, 3, 4]"],
        answer: 2,
        hint: "The slice includes the start index and excludes the end index.",
        explanation: "Indices 1, 2 and 3 hold 1, 2 and 3."
      },
      {
        question: "In Python, after a = [3, 1, 2] and a.sort(), what is printed by print(a[-1])?",
        options: ["1", "2", "[1, 2, 3]", "3"],
        answer: 3,
        hint: "Negative indices count from the end of the list.",
        explanation: "After sorting, the list is [1, 2, 3], and a[-1] is the last element, 3."
      },
      {
        question: "In Python, what is printed by: s = \"banana\"; print(s.count(\"a\"))?",
        options: ["3", "2", "1", "6"],
        answer: 0,
        hint: "Count each occurrence of the letter a.",
        explanation: "The letter a appears at three positions in banana."
      },
      {
        question: "In Python, what is printed by print(sorted([10, 9, 100]))?",
        options: ["[10, 9, 100]", "[9, 10, 100]", "[100, 10, 9]", "[10, 100, 9]"],
        answer: 1,
        hint: "sorted compares numbers by numeric value, not by their text.",
        explanation: "Numerically, 9 is smallest, then 10, then 100."
      }
  ]
};
