import { join, parse } from "path";
import { debug, WorkspaceFolder } from "vscode";

import { ITestRunnerInterface } from "../interfaces/ITestRunnerInterface";
import { ITestRunnerOptions } from "../interfaces/ITestRunnerOptions";
import { ConfigurationProvider } from "../providers/ConfigurationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";

export class ReactScriptsTestRunner implements ITestRunnerInterface {
  public name: string = "react-scripts";
  public terminalProvider: TerminalProvider = null;
  public configurationProvider: ConfigurationProvider = null;

  get binPath(): string {
    return join("node_modules", ".bin", "react-scripts");
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
    const cleanedFileName = parse(fileName).base;

    const command = `${
      this.binPath
    } test ${cleanedFileName} --testNamePattern="${testName}" --no-cache --watchAll=false ${additionalArguments}`;

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
    const cleanedFileName = parse(fileName).base;

    debug.startDebugging(rootPath, {
      name: "Debug Test",
      type: "node",
      request: "launch",
      args: [
        "test",
        cleanedFileName,
        `--testNamePattern="${testName}"`,
        "--runInBand",
        "--no-cache",
        "--watchAll=false",
        ...additionalArguments.split(" ")
      ],
      env: environmentVariables,
      protocol: "inspector",
      console: "integratedTerminal",
      internalConsoleOptions: "neverOpen",
      runtimeExecutable: "${workspaceFolder}/node_modules/.bin/react-scripts"
    });
  }
}
