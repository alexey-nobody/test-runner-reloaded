import { CodeLens, Range, WorkspaceFolder } from 'vscode';

export class TestDebugRunnerCodeLens extends CodeLens {
  constructor(rootPath: WorkspaceFolder, fileName: string, testName: string, range: Range) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: 'test-runner-reloaded.debug.test',
      title: 'Debug Test',
    });
  }
}
