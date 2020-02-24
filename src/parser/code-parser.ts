import { parse } from '@babel/parser';

const testTokens = ['describe', 'it', 'test'];

function getNextStringVal(tokens, start) {
  for (let i = start; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (['string', 'template'].includes(token.type.label)) {
      return token.value;
    }
  }
  return null;
}

function codeParser(sourceCode) {
  const ast = parse(sourceCode, {
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
    tokens: true,
  });

  return ast.tokens
    .map(({ value, loc, type }, index) => {
      if (!testTokens.includes(value)) {
        return null;
      }
      if (type.label !== 'name') {
        return null;
      }
      const nextToken = ast.tokens[index + 1];
      if (!nextToken.type.startsExpr) {
        return null;
      }

      return {
        loc,
        testName: getNextStringVal(ast.tokens, index + 2),
      };
    })
    .filter(Boolean);
}

export { codeParser };
