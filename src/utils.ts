export function formatTestName(testName: string) {
  const formattedTestName = testName.replace(/\s/g, '\\s');
  return formattedTestName;
}
