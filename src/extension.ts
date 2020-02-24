import { commands, ExtensionContext, languages } from 'vscode';
import { FILE_SELECTOR } from './constants';
import { TestRunnerCodeLensProvider } from './providers/test-runner-code-lens-provider';
import { runTest, debugTest } from './commands';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCodeLensProvider(FILE_SELECTOR, new TestRunnerCodeLensProvider()),
  );

  commands.registerCommand('test-runner-reloaded.run.test', runTest);
  commands.registerCommand('test-runner-reloaded.debug.test', debugTest);
}
