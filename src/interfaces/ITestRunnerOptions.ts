import { ConfigurationProvider } from '../providers/ConfigurationProvider';
import { TerminalProvider } from '../providers/TerminalProvider';

export interface TestRunnerOptions {
  terminalProvider: TerminalProvider;
  configurationProvider: ConfigurationProvider;
}
