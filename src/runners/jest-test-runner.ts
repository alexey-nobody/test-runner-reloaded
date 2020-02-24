import { join } from 'path';
import { debug, WorkspaceFolder } from 'vscode';
import { TestRunnerInterface } from '../interfaces/test-runner-interface';
import { TestRunnerOptions } from '../interfaces/test-runner-options';
import { ConfigurationProvider } from '../providers/configuration-provider';
import { TerminalProvider } from '../providers/terminal-provider';
import { formatTestName } from '../utils';

export class JestTestRunner implements TestRunnerInterface {
  public name = 'jest';
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return join('node_modules', '.bin', 'jest');
  }

  constructor({ terminalProvider, configurationProvider }: TestRunnerOptions) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    const cleanedFileName = fileName.replace(/\\/g, '/');
    const mainArgs = `${cleanedFileName} --testNamePattern '${formatTestName(testName)}'`;
    const secondArgs = "--runInBand --testRegex '.*.(test|spec|e2e-spec).ts' --rootDir '.'";
    const command = `${this.binPath} ${mainArgs} ${secondArgs} ${additionalArguments}`;

    const terminal = this.terminalProvider.get({ env: environmentVariables }, rootPath);
    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string) {
    const { additionalArguments, environmentVariables } = this.configurationProvider;

    const cleanedFileName = fileName.replace(/\\/g, '/');
    const mainArgs = `${cleanedFileName} --testNamePattern '${formatTestName(testName)}'`;
    const secondArgs = "--runInBand --testRegex '.*.(test|spec|e2e-spec).ts' --rootDir '.'";

    let args = `${mainArgs} ${secondArgs}`;
    if (additionalArguments && additionalArguments.length > 0) {
      args += ` ${additionalArguments}`;
    }

    debug.startDebugging(rootPath, {
      name: 'Debug Test',
      type: 'node',
      request: 'launch',
      args: args.split(' '),
      env: environmentVariables,
      console: 'integratedTerminal',
      program: `\${workspaceFolder}/${this.binPath}`,
    });
  }
}