import { join, parse } from 'path';
import { debug, WorkspaceFolder } from 'vscode';
import { TestRunnerInterface } from '../interfaces/ITestRunnerInterface';
import { TestRunnerOptions } from '../interfaces/ITestRunnerOptions';
import { ConfigurationProvider } from '../providers/ConfigurationProvider';
import { TerminalProvider } from '../providers/TerminalProvider';

export class ReactScriptsTestRunner implements TestRunnerInterface {
  public name = 'react-scripts';
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

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

    const command = `${this.binPath} test ${cleanedFileName} --testNamePattern="${testName}" --no-cache --watchAll=false ${additionalArguments}`;

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
        `--testNamePattern="${testName}"`,
        '--runInBand',
        '--no-cache',
        '--watchAll=false',
        ...additionalArguments.split(' '),
      ],
      env: environmentVariables,
      protocol: 'inspector',
      console: 'integratedTerminal',
      internalConsoleOptions: 'neverOpen',
      // eslint-disable-next-line no-template-curly-in-string
      runtimeExecutable: '${workspaceFolder}/node_modules/.bin/react-scripts',
    });
  }
}
