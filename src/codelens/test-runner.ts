import { CodeLens, Range, WorkspaceFolder, workspace } from 'vscode';

export class TestRunner extends CodeLens {
  constructor(
    rootPath: WorkspaceFolder | typeof workspace,
    fileName: string,
    testName: string,
    range: Range,
  ) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: 'test-runner-reloaded.run.test',
      title: 'Run Test',
    });
  }
}
