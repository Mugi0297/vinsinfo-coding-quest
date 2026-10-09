/* Level-specific question bank. answer is a zero-based option index. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[6] = {
  id: 6,
  title: "Debugging Zone",
  icon: "🛠️",
  description: "Find errors and fix incorrect code.",
  topics: ["Syntax errors", "Logic errors", "Debugging", "Test cases"],
  questions: [
      {
        question: "What can cause an infinite loop?",
        options: ["Using a variable", "Printing a value", "The condition never becomes false", "Declaring an integer"],
        answer: 2,
        hint: "Check whether the loop can terminate.",
        explanation: "A loop may run forever if its condition remains true."
      },
      {
        question: "Which symbol ends most ordinary statements in C?",
        options: [":", ",", "#", ";"],
        answer: 3,
        hint: "It is called a semicolon.",
        explanation: "Most C statements end with a semicolon."
      },
      {
        question: "A program runs but produces a wrong result. What type of error might this be?",
        options: ["Logic error", "Always a syntax error", "Always a linker error", "No error is possible"],
        answer: 0,
        hint: "The program executes, but its reasoning is wrong.",
        explanation: "A logic error causes incorrect behavior despite successful execution."
      },
      {
        question: "In C, if (x = 5) is written when the programmer meant to compare x with 5. What is the bug?",
        options: ["It compares x with 5", "It assigns 5 to x and the condition is always true", "It always causes a syntax error", "It causes a runtime crash"],
        answer: 1,
        hint: "The single = operator assigns. Check what value the assignment produces.",
        explanation: "x = 5 assigns 5 to x and evaluates to 5, which is non-zero and therefore true. The intended comparison should use ==."
      },
      {
        question: "An array has n elements, but the loop is written as for (i = 0; i <= n; i++). What bug occurs?",
        options: ["An infinite loop always", "A compilation error", "Off-by-one error that accesses index n, which is out of bounds", "No bug exists"],
        answer: 2,
        hint: "Valid indices run from 0 to n - 1.",
        explanation: "The loop reaches index n, one past the last valid index, which causes undefined behavior in C."
      },
      {
        question: "Which set of test inputs is best for checking a loop or range boundary?",
        options: ["One random middle value", "Only negative values", "Only zero", "The smallest and largest valid values"],
        answer: 3,
        hint: "Bugs often appear at the edges of a valid range.",
        explanation: "Boundary testing checks the smallest and largest valid inputs, where off-by-one errors usually show up."
      },
      {
        question: "What does a breakpoint do in a debugger?",
        options: ["Pauses execution at a chosen line", "Deletes a variable", "Compiles the code faster", "Fixes errors automatically"],
        answer: 0,
        hint: "It lets you inspect variables while the program is paused.",
        explanation: "A breakpoint pauses execution at a chosen line so you can inspect the program state."
      },
      {
        question: "In Python, what happens when you write if x = 5: to compare x with 5?",
        options: ["It compares x with 5", "SyntaxError", "The condition is always True", "A warning only"],
        answer: 1,
        hint: "Python does not allow assignment inside an if condition this way.",
        explanation: "Python reports a SyntaxError. The comparison operator is ==."
      },
      {
        question: "Which bug happens when a break is missing inside a C switch case?",
        options: ["A compilation error always", "An infinite loop always", "Execution falls through into the next case", "Variables are deleted"],
        answer: 2,
        hint: "Without break, the next case's code also runs.",
        explanation: "Without break, execution continues into the following case, which is called fall-through."
      },
      {
        question: "In Java, what happens when this runs? String s = null; System.out.println(s.length());",
        options: ["0", "Compilation error", "null", "NullPointerException at runtime"],
        answer: 3,
        hint: "A method call on a null reference fails at runtime.",
        explanation: "s is null, so calling length() on it throws a NullPointerException at runtime."
      },
      {
        question: "A variable is used before it is given a value. What is the main risk?",
        options: ["It holds an unpredictable garbage value", "It always holds zero", "It always produces a correct result", "It makes compilation fail"],
        answer: 0,
        hint: "Local variables in C are not automatically set to zero.",
        explanation: "Uninitialized local variables hold whatever was in memory, which is unpredictable."
      },
      {
        question: "A C program is missing a closing brace }. What usually happens?",
        options: ["A runtime crash only", "A compilation error", "No effect at all", "An infinite loop always"],
        answer: 1,
        hint: "The compiler needs every block to be closed.",
        explanation: "Unbalanced braces are a syntax error, so the compiler reports an error."
      },
      {
        question: "In Java, with int x, what does if (x = 5) do?",
        options: ["Runs the block", "Skips the block", "Compilation error", "Runtime exception"],
        answer: 2,
        hint: "In Java, an int assignment does not produce a boolean value.",
        explanation: "The condition must be boolean. An int expression used there is a compile-time error."
      },
      {
        question: "A Java method compares two String objects with == but expects their text to match. What is the likely bug?",
        options: ["Text is compared automatically", "It causes an infinite loop", "It converts text to numbers", "It compares references, not content"],
        answer: 3,
        hint: "== checks whether two references point to the same object.",
        explanation: "Use equals() to compare the content of two strings."
      },
      {
        question: "In C, what is printed by: for (i = 1; i < 10; i++); { printf(\"x\"); }?",
        options: ["x once", "x nine times", "x ten times", "Nothing"],
        answer: 0,
        hint: "The semicolon after the for statement makes its body empty.",
        explanation: "The loop does nothing, and the block after it runs once and prints x."
      },
      {
        question: "Which type of test checks how a program handles an empty list or missing input?",
        options: ["Stress test", "Edge case test", "Regression test only", "Unit test only"],
        answer: 1,
        hint: "Empty values are an example of a boundary or edge condition.",
        explanation: "Edge case tests check unusual or extreme inputs."
      },
      {
        question: "What is regression testing?",
        options: ["Testing performance under heavy load", "Testing only new features", "Re-running earlier tests after changes to catch new breakage", "Deleting old tests"],
        answer: 2,
        hint: "The goal is to check that old behavior still works.",
        explanation: "Regression testing catches bugs that a recent change may have introduced."
      },
      {
        question: "Which debugging technique adds temporary output to show variable values at different points in the code?",
        options: ["Compiling with optimization", "Renaming files", "Reformatting code", "Tracing with print statements"],
        answer: 3,
        hint: "You can see the program state as it runs.",
        explanation: "Printing values at key points lets you trace how the program behaves."
      },
      {
        question: "Which fix corrects if (x = 5) when the programmer meant to compare x with 5?",
        options: ["Use == instead of =", "Add a semicolon", "Remove the if", "Change x to a float"],
        answer: 0,
        hint: "Equality comparison uses a double equals sign.",
        explanation: "== compares values, while = assigns a value."
      },
      {
        question: "A function is meant to return the sum of an array but returns only the last element. What is the most likely cause?",
        options: ["A missing include", "The result is overwritten each time instead of accumulated", "The array is too small", "The return type is wrong"],
        answer: 1,
        hint: "Look at how the result variable changes inside the loop.",
        explanation: "Using sum = a[i] instead of sum += a[i] keeps only the last value."
      },
      {
        question: "A 5-letter word is stored in char s[5] in C. What bug occurs?",
        options: ["The string is too short", "A compiler error always occurs", "The null terminator has no space", "There is no bug"],
        answer: 2,
        hint: "C strings need one extra byte for the end marker.",
        explanation: "The word needs 6 bytes including the terminator, so the terminator does not fit."
      },
      {
        question: "A Python program has inconsistent indentation. Which error is raised?",
        options: ["SyntaxError only", "NameError", "TypeError", "IndentationError"],
        answer: 3,
        hint: "Python uses indentation to define blocks.",
        explanation: "Incorrect indentation raises IndentationError, which is a kind of SyntaxError."
      },
      {
        question: "Using a variable name that was never defined in Python raises which error?",
        options: ["NameError", "TypeError", "ValueError", "IndexError"],
        answer: 0,
        hint: "The name does not exist in the current scope.",
        explanation: "Python raises NameError for undefined names."
      },
      {
        question: "What happens when you run print('5' + 5) in Python?",
        options: ["Prints 10", "TypeError", "Prints 55", "Prints 5"],
        answer: 1,
        hint: "Python does not automatically convert between strings and integers in +.",
        explanation: "Adding a str and an int raises a TypeError."
      },
      {
        question: "In Python, with a = [1, 2], what error occurs when you read a[2]?",
        options: ["ValueError", "KeyError", "IndexError", "It returns 0"],
        answer: 2,
        hint: "The list has indices 0 and 1 only.",
        explanation: "Reading an index outside a list's range raises IndexError."
      },
      {
        question: "In Java, int[] a = new int[3]; a[3] = 1; throws which exception?",
        options: ["NullPointerException", "ArithmeticException", "No exception", "ArrayIndexOutOfBoundsException"],
        answer: 3,
        hint: "Valid indices are 0 to 2.",
        explanation: "Writing to index 3 is outside the array, so Java throws ArrayIndexOutOfBoundsException."
      },
      {
        question: "In Java, int z = 0; int r = 5 / z; throws which exception?",
        options: ["ArithmeticException", "ArrayIndexOutOfBoundsException", "It returns Infinity", "Compilation error"],
        answer: 0,
        hint: "Integer division by zero is a runtime error in Java.",
        explanation: "Dividing an int by zero throws ArithmeticException."
      },
      {
        question: "In C, with int i = 0; while (i < 5) { printf(\"hi\"); }, what is the bug?",
        options: ["Missing semicolon", "i is never updated, so the loop never ends", "Wrong data type", "There is no bug"],
        answer: 1,
        hint: "Check whether the condition can change inside the loop.",
        explanation: "i never changes, so i < 5 stays true forever."
      },
      {
        question: "Which tool lets you run code line by line and inspect variables?",
        options: ["Linter", "Compiler only", "Debugger", "Formatter"],
        answer: 2,
        hint: "Breakpoints are used with this tool.",
        explanation: "A debugger steps through execution and shows variable values."
      },
      {
        question: "What should a good test case include?",
        options: ["Only the program name", "Only a screenshot", "The source file size", "An input, the expected output, and a comparison with the actual output"],
        answer: 3,
        hint: "A test needs something to compare against.",
        explanation: "A good test defines the input and the expected result, then checks the actual result."
      }
  ]
};
