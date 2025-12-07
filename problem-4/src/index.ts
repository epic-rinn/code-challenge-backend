/**
 * Most efficient way to sum up to n by leveraging the formula for the sum of an arithmetic series S = n/2 * (a + l)
 * where a is the first term (1) and l is the last term (n)
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
export function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Recursive way to sum up to n by adding n to the sum of n - 1
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function sum_to_n_b(n: number): number {
  if (n == 1) return 1;
  return n + sum_to_n_b(n - 1);
}

/**
 * Iterative way to sum up to n by adding n to the sum of n - 1
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function sum_to_n_c(n: number): number {
  let sum = 0;
  while (n > 0) {
    sum += n;
    n--;
  }
  return sum;
}
