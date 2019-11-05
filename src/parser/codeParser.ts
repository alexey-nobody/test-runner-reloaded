import { parse } from '@babel/parser';

const testTokens = ['describe', 'it', 'test'];

function codeParser(sourceCode) {
  const ast = parse(sourceCode, {
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
    tokens: true,
  });

  return ast.tokens
    .map(({ value, loc, type }, index) => {
      if (testTokens.indexOf(value) === -1) {
        return;
      }
      if (type.label !== 'name') {
        return;
      }
      const nextToken = ast.tokens[index + 1];
      if (!nextToken.type.startsExpr) {
        return;
      }

      return {
        loc,
        testName: ast.tokens[index + 2].value,
      };
    })
    .filter(Boolean);
}

export { codeParser };
