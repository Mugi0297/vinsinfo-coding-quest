/* Level-specific question bank. Correct answers are kept server-side. */
window.QUEST_LEVELS = window.QUEST_LEVELS || {};
window.QUEST_LEVELS[8] = {
  id: 8,
  title: "VINSINFO Mock Round",
  icon: "📝",
  description: "Mixed placement-style practice questions.",
  topics: ["Programming MCQs", "Output questions", "Logic", "Fundamentals"],
  questions: [
      {
        question: "Which SQL command retrieves data from a table?",
        options: ["GET", "FETCHROW", "SELECT", "OPEN"],
        hint: "It is the standard SQL query command.",
        explanation: "SELECT retrieves rows and columns from database tables."
      },
      {
        question: "Which Java keyword is used to inherit a class?",
        options: ["implements", "inherits", "superclass", "extends"],
        hint: "A subclass uses this keyword with its parent class.",
        explanation: "Java uses extends for class inheritance."
      },
      {
        question: "Which Python collection stores key-value pairs?",
        options: ["dictionary", "list", "tuple", "set"],
        hint: "It is also called a dict.",
        explanation: "A Python dictionary maps keys to values."
      },
      {
        question: "In SQL, which clause filters groups after GROUP BY has been applied?",
        options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
        hint: "WHERE filters individual rows before grouping, not groups.",
        explanation: "HAVING filters the groups produced by GROUP BY, for example keeping only groups whose count is above 2."
      },
      {
        question: "A column has 5 rows, and 2 of them are NULL. What does COUNT(column) return?",
        options: ["5", "2", "3", "0"],
        hint: "COUNT(column) ignores NULL values, while COUNT(*) does not.",
        explanation: "COUNT(column) counts only non-NULL values, so the result is 3."
      },
      {
        question: "In Java, what is printed by: int[] a = new int[3]; System.out.println(a[0]);",
        options: ["null", "Compilation error", "Garbage value", "0"],
        hint: "Numeric array elements in Java get a default value.",
        explanation: "Java initializes numeric array elements to 0 by default."
      },
      {
        question: "In Java, String a = \"hi\"; String b = \"hi\"; What does System.out.println(a == b); print?",
        options: ["true", "false", "Compilation error", "NullPointerException"],
        hint: "Identical string literals are stored once in the string pool.",
        explanation: "Both variables refer to the same pooled \"hi\" object, so == compares true. Use equals() to compare content reliably."
      },
      {
        question: "In Python, after x = [1, 2, 3]; y = x; y.append(4); what is len(x)?",
        options: ["3", "4", "Error", "1"],
        hint: "y = x copies the reference, not the list.",
        explanation: "x and y refer to the same list, so appending through y also changes x, making its length 4."
      },
      {
        question: "In Python 3, what is printed by: print(type(3 / 2), type(3 // 2))?",
        options: ["int int", "float float", "float int", "int float"],
        hint: "/ always gives a float in Python 3. // gives floor division on integers.",
        explanation: "3 / 2 is a float, and 3 // 2 is an int."
      },
      {
        question: "In Python, what is printed by: print([i for i in range(10) if i % 3 == 0])?",
        options: ["[3, 6, 9]", "[0, 3, 6]", "[1, 4, 7]", "[0, 3, 6, 9]"],
        hint: "range(10) starts at 0 and goes up to 9. Check which values are divisible by 3.",
        explanation: "The values 0, 3, 6 and 9 are divisible by 3, and 0 is included."
      },
      {
        question: "Which SQL keyword removes duplicate rows from a SELECT result?",
        options: ["DISTINCT", "UNIQUE", "SINGLE", "FILTER"],
        hint: "It is used directly after SELECT.",
        explanation: "SELECT DISTINCT returns each distinct row once."
      },
      {
        question: "Which JOIN returns only the rows that have matching values in both tables?",
        options: ["LEFT JOIN", "INNER JOIN", "CROSS JOIN", "RIGHT JOIN only"],
        hint: "It keeps only the matching pairs.",
        explanation: "INNER JOIN returns rows where the join condition is satisfied in both tables."
      },
      {
        question: "Which SQL command adds a new row to a table?",
        options: ["ADD", "UPDATE", "INSERT", "PUT"],
        hint: "It is the standard command for adding data.",
        explanation: "INSERT INTO adds new rows."
      },
      {
        question: "Which SQL command changes existing rows?",
        options: ["MODIFY", "ALTER ROW", "SET", "UPDATE"],
        hint: "It is used with SET and WHERE.",
        explanation: "UPDATE changes values in existing rows."
      },
      {
        question: "Which constraint uniquely identifies each row in a table?",
        options: ["PRIMARY KEY", "FOREIGN KEY", "CHECK", "DEFAULT"],
        hint: "It is the main identifier of a table row.",
        explanation: "A PRIMARY KEY is unique and not NULL."
      },
      {
        question: "Which aggregate function returns the average of a column?",
        options: ["MEAN", "AVG", "SUM", "MID"],
        hint: "It is the short form of average.",
        explanation: "AVG returns the mean of the non-NULL values."
      },
      {
        question: "Which Java keyword prevents a class from being subclassed?",
        options: ["static", "private", "final", "abstract"],
        hint: "It is used for constants as well as classes.",
        explanation: "A final class cannot be extended."
      },
      {
        question: "Which Java keyword is used to implement an interface?",
        options: ["extends", "inherits", "uses", "implements"],
        hint: "A class uses this keyword with an interface name.",
        explanation: "implements is used by classes that provide an interface's methods."
      },
      {
        question: "In Java, after int x = 10; x += 5.5;, what is printed by System.out.println(x);?",
        options: ["15", "15.5", "16", "Compilation error"],
        hint: "Compound assignment includes an implicit cast back to int.",
        explanation: "10 + 5.5 = 15.5, which is cast to int, so the result is 15."
      },
      {
        question: "Which access modifier allows access only within the same class in Java?",
        options: ["public", "private", "protected", "default"],
        hint: "It is the most restrictive modifier.",
        explanation: "private members are visible only inside their own class."
      },
      {
        question: "In Java, what does new String(\"a\") == \"a\" evaluate to?",
        options: ["true", "Compilation error", "false", "null"],
        hint: "new creates a new object, which is not the pooled literal.",
        explanation: "The two references point to different objects, so == gives false."
      },
      {
        question: "Which Java collection does not allow duplicate elements?",
        options: ["List", "Array", "Queue", "Set"],
        hint: "Its name is also used in math for a collection of unique items.",
        explanation: "A Set stores only unique elements."
      },
      {
        question: "What is the default value of a boolean instance field in Java?",
        options: ["false", "true", "null", "0"],
        hint: "Primitive fields get default values.",
        explanation: "Boolean fields default to false."
      },
      {
        question: "In Python, what is printed by print(bool([]))?",
        options: ["True", "False", "[]", "Error"],
        hint: "An empty list is falsy.",
        explanation: "Empty containers are False when converted to bool."
      },
      {
        question: "In Python, what is printed by print({1, 2, 2, 3})?",
        options: ["{1, 2, 2, 3}", "[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)"],
        hint: "A set stores each value only once.",
        explanation: "The duplicate 2 is removed, and the set prints as {1, 2, 3}."
      },
      {
        question: "In Python, what is printed by print(d.get(\"b\", 0)) when d = {\"a\": 1}?",
        options: ["None", "KeyError", "1", "0"],
        hint: "get returns a default value when the key is missing.",
        explanation: "The key \"b\" is missing, so get returns the default 0."
      },
      {
        question: "In Python, what is printed by print(list(map(lambda x: x * 2, [1, 2, 3])))?",
        options: ["[2, 4, 6]", "[1, 2, 3]", "[1, 4, 9]", "[2, 4]"],
        hint: "map applies the function to each element.",
        explanation: "Each element is doubled: 2, 4 and 6."
      },
      {
        question: "In Python, what is printed by print(\"Hello\"[1:3])?",
        options: ["He", "el", "ell", "llo"],
        hint: "The slice includes index 1 and excludes index 3.",
        explanation: "Indices 1 and 2 are e and l."
      },
      {
        question: "In Python, with def f(a, b=2): return a + b, what is printed by print(f(1))?",
        options: ["1", "2", "3", "Error"],
        hint: "The default value of b is used when no argument is given.",
        explanation: "f(1) computes 1 + 2 = 3."
      },
      {
        question: "In Python, what is type(t).__name__ for t = (1,)?",
        options: ["int", "list", "set", "tuple"],
        hint: "The trailing comma makes it a tuple, not a number.",
        explanation: "(1,) is a one-element tuple."
      }
  ]
};
