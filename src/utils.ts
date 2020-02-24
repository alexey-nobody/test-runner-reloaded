export function formatTestName(testName: string) {
  let formattedTestName = testName.replace(/\s/g, '\\s');
  formattedTestName = formattedTestName.replace(/\x28/g, '\\(');
  formattedTestName = formattedTestName.replace(/\x29/g, '\\)');
  return formattedTestName;
}
