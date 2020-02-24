import { relative } from 'path';
import { WorkspaceFolder } from 'vscode';
import { getTestRunner } from './runners/test-runner-factory';

export async function debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName);
  const testRunner = await getTestRunner(rootPath);

  testRunner.debugTest(rootPath, relativeFilename, testName);
}

export async function runTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
  const relativeFilename = relative(rootPath.uri.fsPath, fileName);
  const testRunner = await getTestRunner(rootPath);

  testRunner.runTest(rootPath, relativeFilename, testName);
}
