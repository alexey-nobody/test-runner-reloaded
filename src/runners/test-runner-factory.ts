import { exists } from 'fs';
import { join } from 'path';
import { WorkspaceFolder } from 'vscode';
import { TestRunnerInterface } from '../interfaces/test-runner';
import { ConfigurationProvider } from '../providers/configuration-provider';
import { TerminalProvider } from '../providers/terminal-provider';
import { ReactScriptsTestRunner } from './react-scripts-test-runner';
import { JestTestRunner } from './jest-test-runner';
import { MochaTestRunner } from './mocha-test-runner';

const terminalProvider = new TerminalProvider();

function doesFileExist(filePath: string): Promise<boolean> {
  return new Promise(resolve => {
    exists(filePath, doesExist => {
      resolve(doesExist);
    });
  });
}

async function getAvailableTestRunner(
  testRunners: TestRunnerInterface[],
  rootPath: WorkspaceFolder,
): Promise<TestRunnerInterface> {
  for (const runner of testRunners) {
    const doesRunnerExist = await doesFileExist(join(rootPath.uri.fsPath, runner.binPath));
    if (doesRunnerExist) {
      return runner;
    }
  }

  throw new Error('No test runner in your project. Please install one.');
}

export async function getTestRunner(rootPath: WorkspaceFolder): Promise<TestRunnerInterface> {
  const configurationProvider = new ConfigurationProvider(rootPath);

  const reactScriptsTestRunner = new ReactScriptsTestRunner({
    configurationProvider,
    terminalProvider,
  });

  const jestTestRunner = new JestTestRunner({
    configurationProvider,
    terminalProvider,
  });

  const mochaTestRunner = new MochaTestRunner({
    configurationProvider,
    terminalProvider,
  });

  return getAvailableTestRunner(
    [reactScriptsTestRunner, jestTestRunner, mochaTestRunner],
    rootPath,
  );
}
