import { join } from "path";
import { debug, WorkspaceFolder } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ITestRunnerOptions } from "../interfaces/ITestRunnerOptions";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export class JestTestRunner implements ITestRunnerInterface {
  public name: string = "jest";
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return join("node_modules", ".bin", "jest");
  }

  constructor({ terminalProvider, configurationProvider }: ITestRunnerOptions) {
    this.terminalProvider = terminalProvider;
    this.configurationProvider = configurationProvider;
  }

  public runTest(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider
      .environmentVariables;

    // We force slash instead of backslash for Windows
    const cleanedFileName = fileName.replace(/\\/g, "/");

    const command = `${
      this.binPath
    } ${cleanedFileName} --rootDir="." --testRegex=".*.(test|spec|e2e-spec).ts" --testNamePattern="${testName}" ${additionalArguments}`;

    const terminal = this.terminalProvider.get(
      { env: environmentVariables },
      rootPath
    );

    terminal.sendText(command, true);
    terminal.show(true);
  }

  public debugTest(
    rootPath: WorkspaceFolder,
    fileName: string,
    testName: string
  ) {
    const additionalArguments = this.configurationProvider.additionalArguments;
    const environmentVariables = this.configurationProvider
      .environmentVariables;
    // We force slash instead of backslash for Windows
    const cleanedFileName = fileName.replace(/\\/g, "/");

    debug.startDebugging(rootPath, {
      name: "Debug Test",
      type: "node",
      request: "launch",
      args: [
        cleanedFileName,
        `--testNamePattern`,
        testName,
        "--runInBand",
        ...additionalArguments.split(" ")
      ],
      env: environmentVariables,
      console: "integratedTerminal",
      program: "${workspaceFolder}/node_modules/jest/bin/jest.js"
    });
  }
}
