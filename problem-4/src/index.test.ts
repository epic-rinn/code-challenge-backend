import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index";

describe("sum_to_n functions", () => {
  it("sum_to_n_a computes sum up to n correctly", () => {
    expect(sum_to_n_a(5)).toBe(15);
    expect(sum_to_n_a(1)).toBe(1);
    expect(sum_to_n_a(10)).toBe(55);
  });

  it("sum_to_n_b computes sum up to n correctly", () => {
    expect(sum_to_n_b(5)).toBe(15);
    expect(sum_to_n_b(1)).toBe(1);
    expect(sum_to_n_a(10)).toBe(55);
  });

  it("sum_to_n_c computes sum up to n correctly", () => {
    expect(sum_to_n_c(5)).toBe(15);
    expect(sum_to_n_c(1)).toBe(1);
    expect(sum_to_n_a(10)).toBe(55);
  });
});
