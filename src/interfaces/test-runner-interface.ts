import { WorkspaceFolder } from 'vscode';
import { ConfigurationProvider } from '../providers/configuration-provider';
import { TerminalProvider } from '../providers/terminal-provider';

export interface TestRunnerInterface {
  name: string;
  binPath: string;
  terminalProvider: TerminalProvider;
  configurationProvider: ConfigurationProvider;

  runTest(rootPath: WorkspaceFolder, fileName: string, testName: string): void;
  debugTest(rootPath: WorkspaceFolder, fileName: string, testName: string): void;
}
