import { CodeLens, Range, WorkspaceFolder } from 'vscode';

export class TestRunner extends CodeLens {
  constructor(rootPath: WorkspaceFolder, fileName: string, testName: string, range: Range) {
    super(range, {
      arguments: [rootPath, fileName, testName],
      command: 'test-runner-reloaded.run.test',
      title: 'Run Test',
    });
  }
}
