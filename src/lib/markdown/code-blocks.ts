const FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})/;

export function removeFencedCode(markdown: string): string {
  const keptLines: string[] = [];
  let openFence: string | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const fence = FENCE_PATTERN.exec(line)?.[1];

    if (openFence === null) {
      if (fence) {
        openFence = fence;
        continue;
      }
      keptLines.push(line);
      continue;
    }

    if (fence && fence[0] === openFence[0] && fence.length >= openFence.length) {
      openFence = null;
    }
  }

  return keptLines.join("\n");
}
