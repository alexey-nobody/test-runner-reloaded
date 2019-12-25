import { commands, ExtensionContext, languages } from 'vscode';
import { debugTest } from './commands/debugTestCommand';
import { runTest } from './commands/runTestCommand';
import { FILE_SELECTOR } from './constants/fileSelector';
import { TestRunnerCodeLensProvider } from './providers/TestRunnerCodeLensProvider';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCodeLensProvider(FILE_SELECTOR, new TestRunnerCodeLensProvider()),
  );

  commands.registerCommand('test-runner-reloaded.run.test', runTest);
  commands.registerCommand('test-runner-reloaded.debug.test', debugTest);
}
