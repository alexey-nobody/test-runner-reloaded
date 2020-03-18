import { join } from 'path';
import { debug, WorkspaceFolder } from 'vscode';
import { TestRunner } from '../interfaces/test-runner';
import { TestRunnerOptions } from '../interfaces/test-runner-options';
import { ConfigurationProvider } from '../providers/configuration-provider';
import { TerminalProvider } from '../providers/terminal-provider';
import { formatTestName } from '../utils';

export class MochaTestRunner implements TestRunner {
  public name = 'mocha';

  public terminalProvider: TerminalProvider;

  public configurationProvider: ConfigurationProvider;

  get binPath(): string {
    return join('node_modules', '.bin', 'mocha');
  }

  constructor(testRunnerOptions: TestRunnerOptions) {
    this.terminalProvider = testRunnerOptions.terminalProvider;
    this.configurationProvider = testRunnerOptions.configurationProvider;
  }

  public runTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    const mainArgs = `${fileName} --grep="${formatTestName(testName)}" ${additionalArguments}`;
    const command = `${this.binPath} ${mainArgs}`;

    const terminal = this.terminalProvider.get({ env: environmentVariables }, rootPath);

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    debug.startDebugging(rootPath, {
      args: [
        fileName,
        '--grep',
        formatTestName(testName),
        '--no-timeout',
        ...additionalArguments.split(' '),
      ],
      console: 'integratedTerminal',
      env: environmentVariables,
      name: 'Debug Test',
      program: `\${workspaceFolder}/${this.binPath}`,
      request: 'launch',
      type: 'node',
    });
  }
}
