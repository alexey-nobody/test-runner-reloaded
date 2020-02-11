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
        testName: getTestNameFromToken(ast.tokens[index + 2]),
      };
    })
    .filter(Boolean);
}

function getTestNameFromToken(token) {
  switch(token.type) {
    case 'Literal':
      return token.value;
    case 'TemplateElement':
      return token.value.raw;
    default:
      throw Error(`Unexepected token type for testName: ${token.type}`);
  }
}

export { codeParser };
