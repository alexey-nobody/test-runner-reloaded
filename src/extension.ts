import { commands, ExtensionContext, languages } from 'vscode';
import { debugTest, runTest } from './commands';
import { FILE_SELECTOR } from './constants';
import { TestRunnerProvider } from './providers/test-runner-provider';

export function activate(context: ExtensionContext) {
  const testRunnerProvider = new TestRunnerProvider();
  const registeredProvider = languages.registerCodeLensProvider(FILE_SELECTOR, testRunnerProvider);
  context.subscriptions.push(registeredProvider);

  commands.registerCommand('test-runner-reloaded.run.test', runTest);
  commands.registerCommand('test-runner-reloaded.debug.test', debugTest);
}
