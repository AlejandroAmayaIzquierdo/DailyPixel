const encode = (nums: string[][]): string[] => {
  const toConvert = nums.flat();
  if (toConvert.length === 0) return [];

  const encoded: string[] = [];
  let count = 1;

  for (let i = 1; i <= toConvert.length; i++) {
    if (i < toConvert.length && toConvert[i] === toConvert[i - 1]) {
      count++;
    } else {
      encoded.push(count.toString(), toConvert[i - 1]);
      count = 1;
    }
  }

  return encoded;
};

const decode = (nums: string[]): string[] => {
  const decoded: string[] = [];
  for (let i = 0; i < nums.length; i += 2) {
    const run_length = parseInt(nums[i], 10);
    const value = nums[i + 1];
    for (let ii = 0; ii < run_length; ii++) {
      decoded.push(value);
    }
  }
  return decoded;
};

export { encode, decode };
