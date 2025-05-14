import { cn } from "@/lib/utils";

describe("cn", () => {
  it("should merge classes correctly", () => {
    expect(cn("a", "b")).toBe("a b");
    expect(cn("a", "b", "c")).toBe("a b c");
    expect(cn("a", { b: true }, { c: false })).toBe("a b");
    expect(cn("a", { b: true }, { c: true })).toBe("a b c");
    expect(cn("a", ["b", "c"])).toBe("a b c");
    expect(cn(["a", "b", "c"])).toBe("a b c");
    expect(cn(["a", "b"], { c: true })).toBe("a b c");
  });

  it('should handle empty input', () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn([])).toBe("");
    expect(cn({})).toBe("");
  })

  it('should handle falsy inputs', () => {
    expect(cn("a", null, "b")).toBe("a b");
    expect(cn("a", undefined, "b")).toBe("a b");
    expect(cn("a", false, "b")).toBe("a b");
    expect(cn("a", 0, "b")).toBe("a b");
  })

  it('should handle complex mixed inputs', () => {
    expect(cn("a", { b: true, c: false }, ["d", "e"], undefined, null, false, "f", {g:true})).toBe("a b d e f g");
  })

  it('should merge duplicated classes properly', () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-2", "m-2")).toBe("p-2 m-2");
    expect(cn("p-2 p-4", "m-2")).toBe("p-4 m-2");
    expect(cn("p-2 m-2", "m-4")).toBe("p-2 m-4");
  });
});