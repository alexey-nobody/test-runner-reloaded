import { ConfigurationProvider } from '../providers/configuration-provider';
import { TerminalProvider } from '../providers/terminal-provider';

export interface TestRunnerOptions {
  terminalProvider: TerminalProvider;
  configurationProvider: ConfigurationProvider;
}
