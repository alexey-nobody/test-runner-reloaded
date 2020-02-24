import { CodeLens, CodeLensProvider, TextDocument, workspace } from 'vscode';
import { TestDebugRunnerCodeLens } from '../codelens/test-debug-runner-code-lens';
import { TestRunnerCodeLens } from '../codelens/test-runner-code-lens';
import { codeParser } from '../parser/code-parser';

function getRootPath({ uri }) {
  const activeWorkspace = workspace.getWorkspaceFolder(uri);

  if (activeWorkspace) {
    return activeWorkspace;
  }

  return workspace;
}

function getCodeLens(rootPath, fileName, testName, startPosition) {
  const testRunnerCodeLens = new TestRunnerCodeLens(rootPath, fileName, testName, startPosition);

  const testDebugRunnerCodeLens = new TestDebugRunnerCodeLens(
    rootPath,
    fileName,
    testName,
    startPosition,
  );

  return [testRunnerCodeLens, testDebugRunnerCodeLens];
}

export class TestRunnerCodeLensProvider implements CodeLensProvider {
  public provideCodeLenses(document: TextDocument): CodeLens[] | Thenable<CodeLens[]> {
    const createRangeObject = ({ line }) => document.lineAt(line - 1).range;
    const rootPath = getRootPath(document);

    return codeParser(document.getText()).reduce(
      (acc, { loc, testName }) => [
        ...acc,
        ...getCodeLens(rootPath, document.fileName, testName, createRangeObject(loc.start)),
      ],
      [],
    );
  }

  public resolveCodeLens?(): CodeLens | Thenable<CodeLens> {
    return null;
  }
}
