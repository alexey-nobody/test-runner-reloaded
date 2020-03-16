import { parse } from '@babel/parser';
import { File } from '@babel/types';

const testTokens = ['describe', 'it', 'test'];

function getTestName(ast: File, start: number): string | null {
  const { tokens } = ast;
  for (let i = start; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (['string', 'template'].includes(token.type.label)) {
      return token.value;
    }
  }
  return null;
}

function codeParser(sourceCode: string) {
  const ast: File = parse(sourceCode, {
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
    tokens: true,
  });

  return ast.tokens
    .map(({ value, loc, type }, index: number) => {
      if (!testTokens.includes(value) || type.label !== 'name') {
        return null;
      }

      const nextToken = ast.tokens[index + 1];
      if (!nextToken.type.startsExpr) {
        return null;
      }

      const testName = getTestName(ast, index + 2);
      return { loc, testName };
    })
    .filter(Boolean);
}

export { codeParser };
