import { commands, ExtensionContext, languages } from 'vscode';
import { debugTest } from './commands/debug-test-command';
import { runTest } from './commands/run-test-command';
import { FILE_SELECTOR } from './constants';
import { TestRunnerCodeLensProvider } from './providers/test-runner-code-lens-provider';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCodeLensProvider(FILE_SELECTOR, new TestRunnerCodeLensProvider()),
  );

  commands.registerCommand('test-runner-reloaded.run.test', runTest);
  commands.registerCommand('test-runner-reloaded.debug.test', debugTest);
}
