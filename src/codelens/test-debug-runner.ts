import { CodeLens, Range, workspace, WorkspaceFolder } from 'vscode';

export class TestDebugRunner extends CodeLens {
  constructor(
    rootPath: WorkspaceFolder | typeof workspace,
    fileName: string,
    testName: string,
    range: Range,
  ) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: 'test-runner-reloaded.debug.test',
      title: 'Debug Test',
    });
  }
}
