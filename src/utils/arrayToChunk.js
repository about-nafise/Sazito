export const arrayToChunk = (arr, max) => {
  const size = Math.min(max, Math.ceil(arr?.length / 2));
  return Array.from({ length: Math.ceil(arr?.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};
