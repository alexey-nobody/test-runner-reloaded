import { join, parse } from 'path';
import { debug, WorkspaceFolder } from 'vscode';
import { TestRunnerInterface } from '../interfaces/test-runner-interface';
import { TestRunnerOptions } from '../interfaces/test-runner-options';
import { ConfigurationProvider } from '../providers/configuration-provider';
import { TerminalProvider } from '../providers/terminal-provider';
import { formatTestName } from '../utils';

export class ReactScriptsTestRunner implements TestRunnerInterface {
  public name = 'react-scripts';
  public terminalProvider: TerminalProvider;
  public configurationProvider: ConfigurationProvider;

  get binPath(): string {
    return join('node_modules', '.bin', 'react-scripts');
  }

  constructor({ terminalProvider, configurationProvider }: TestRunnerOptions) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    const cleanedFileName = parse(fileName).base;

    const mainArgs = `test ${cleanedFileName} --testNamePattern="${formatTestName(testName)}"`;
    const command = `${this.binPath} ${mainArgs} --no-cache --watchAll=false ${additionalArguments}`;

    const terminal = this.terminalProvider.get({ env: environmentVariables }, rootPath);

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    const cleanedFileName = parse(fileName).base;

    debug.startDebugging(rootPath, {
      name: 'Debug Test',
      type: 'node',
      request: 'launch',
      args: [
        'test',
        cleanedFileName,
        `--testNamePattern="${formatTestName(testName)}"`,
        '--runInBand',
        '--no-cache',
        '--watchAll=false',
        ...additionalArguments.split(' '),
      ],
      env: environmentVariables,
      protocol: 'inspector',
      console: 'integratedTerminal',
      internalConsoleOptions: 'neverOpen',
      runtimeExecutable: `\${workspaceFolder}/${this.binPath}`,
    });
  }
}
