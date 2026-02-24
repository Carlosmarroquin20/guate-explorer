// This is a single-line comment

/*
  This is a multi-line comment
  It can span across multiple lines
*/

// Define a simple function
function greet(name: string): string {
  // Return a greeting message
  return `Hello, ${name}!`;
}

// Call the function
const message: string = greet("Test User");

// Print the result to the console
console.log(message);

/**
 * This is a documentation comment (JSDoc style)
 * It describes what the function does
 * @param a First number
 * @param b Second number
 * @returns The sum of both numbers
 */
function add(a: number, b: number): number {
  return a + b;
}

// Example usage
const result: number = add(5, 3);
console.log("Sum:", result);