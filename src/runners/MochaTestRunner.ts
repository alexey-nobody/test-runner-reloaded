import { join } from 'path';
import { debug, WorkspaceFolder } from 'vscode';
import { TestRunnerInterface } from '../interfaces/ITestRunnerInterface';
import { TestRunnerOptions } from '../interfaces/ITestRunnerOptions';
import { ConfigurationProvider } from '../providers/ConfigurationProvider';
import { TerminalProvider } from '../providers/TerminalProvider';

export class MochaTestRunner implements TestRunnerInterface {
  public name = 'mocha';
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return join('node_modules', '.bin', 'mocha');
  }

  constructor({ terminalProvider, configurationProvider }: TestRunnerOptions) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    const command = `${this.binPath} ${fileName} --grep="${testName}" ${additionalArguments}`;

    const terminal = this.terminalProvider.get({ env: environmentVariables }, rootPath);

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    debug.startDebugging(rootPath, {
      args: [fileName, '--grep', testName, '--no-timeout', ...additionalArguments.split(' ')],
      console: 'integratedTerminal',
      env: environmentVariables,
      name: 'Debug Test',
      // eslint-disable-next-line no-template-curly-in-string
      program: '${workspaceFolder}/node_modules/mocha/bin/_mocha',
      request: 'launch',
      type: 'node',
    });
  }
}
