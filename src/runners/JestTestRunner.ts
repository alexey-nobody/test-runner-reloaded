import { join } from 'path';
import { debug, WorkspaceFolder } from 'vscode';
import { ITestRunnerInterface } from '../interfaces/ITestRunnerInterface';
import { ITestRunnerOptions } from '../interfaces/ITestRunnerOptions';
import { ConfigurationProvider } from '../providers/ConfigurationProvider';
import { TerminalProvider } from '../providers/TerminalProvider';

export class JestTestRunner implements ITestRunnerInterface {
  public name: string = 'jest';
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return join('node_modules', '.bin', 'jest');
  }

  constructor({ terminalProvider, configurationProvider }: ITestRunnerOptions) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider.environmentVariables;

    // We force slash instead of backslash for Windows
    const cleanedFileName = fileName.replace(/\\/g, '/');

    const mainArgs = `-i ${cleanedFileName} --testNamePattern '${testName}'`;
    const secondArgs = `--runInBand --testRegex '.*.(test|spec|e2e-spec).ts' --rootDir '.'`;
    const command = `${this.binPath} ${mainArgs} ${secondArgs} ${additionalArguments}`;

    const terminal = this.terminalProvider.get({ env: environmentVariables }, rootPath);

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider.environmentVariables;
    const cleanedFileName = fileName.replace(/\\/g, '/');

    const mainArgs = `-i ${cleanedFileName} --testNamePattern '${testName}'`;
    const secondArgs = `--runInBand --testRegex '.*.(test|spec|e2e-spec).ts' --rootDir '.'`;

    const formatedArgs = [];
    formatedArgs.push(...mainArgs.split(' '));
    formatedArgs.push(...secondArgs.split(' '));
    if (additionalArguments && additionalArguments.length > 0) {
      formatedArgs.push(...additionalArguments);
    }

    debug.startDebugging(rootPath, {
      name: 'Debug Test',
      type: 'node',
      request: 'launch',
      args: formatedArgs,
      env: environmentVariables,
      console: 'integratedTerminal',
      program: '${workspaceFolder}/node_modules/jest/bin/jest.js',
    });
  }
}
