import {
  CodeLens,
  CodeLensProvider,
  Range,
  TextDocument,
  workspace,
  WorkspaceFolder,
} from 'vscode';
import { TestDebugRunner } from '../codelens/test-debug-runner';
import { TestRunner } from '../codelens/test-runner';
import { codeParser } from '../parser/code-parser';

export class TestRunnerProvider implements CodeLensProvider {
  private getCodeLens(
    rootPath: WorkspaceFolder | typeof workspace,
    fileName: string,
    testName: string,
    startPosition: Range,
  ) {
    const testRunner = new TestRunner(rootPath, fileName, testName, startPosition);
    const testDebugRunner = new TestDebugRunner(rootPath, fileName, testName, startPosition);
    return [testRunner, testDebugRunner];
  }

  private getRootPath(textDocument: TextDocument): WorkspaceFolder | typeof workspace {
    const { uri } = textDocument;
    const activeWorkspace = workspace.getWorkspaceFolder(uri);
    if (activeWorkspace) {
      return activeWorkspace;
    }
    return workspace;
  }

  public provideCodeLenses(document: TextDocument): CodeLens[] | Thenable<CodeLens[]> {
    const createRangeObject = ({ line }: { line: number }) => document.lineAt(line - 1).range;
    const rootPath = this.getRootPath(document);
    const sourceCode: string = document.getText();
    return codeParser(sourceCode).reduce(
      (acc: string, { loc, testName }: { loc: Range; testName: string }) => [
        ...acc,
        ...this.getCodeLens(rootPath, document.fileName, testName, createRangeObject(loc.start)),
      ],
      [],
    );
  }

  public resolveCodeLens?(): CodeLens | Thenable<CodeLens> | null {
    return null;
  }
}
