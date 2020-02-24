import * as assert from 'assert';
import { codeParser } from '../../src/parser/code-parser';

suite('codeParser Tests', () => {
  test('Valid Token', () => {
    const code = `
            describe('Fake test', () => {});
        `;
    assert.equal(1, codeParser(code).length);
  });

  test('Invalid Tokens', () => {
    const code = `
            var test = 'Fluo';
            let src = {test: true, type: 'BANK'};
            if (!src.test && src.type === 'BANK') {
                let firstName = 'test';
            }
        `;
    assert.equal(0, codeParser(code).length);
  });

  test('Template string syntax', () => {
    const code = `
            describe(\`Fake test\`, () => {});
        `;
    assert.equal(1, codeParser(code).length);
  });

  test('Jsx syntax', () => {
    const code = `
        describe("JsonFormTextField", () => {

            test("Test render", () => {
                const config: ITextFieldConfig = {
                    fieldType: "text",
                    name: "Owner",
                };
                const wrapper = mount(<FormWrapper>
                    <JsonFormTextField
                        config={config}
                        value={null} />
                </FormWrapper>);
                const ownerInput = wrapper.find("input[type='text'][id='Owner']");
                expect(ownerInput.length).toBe(1);
                ownerInput.simulate("change");
            });
        });
        `;
    assert.equal(2, codeParser(code).length);
  });
});
