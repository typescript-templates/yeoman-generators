import { BaseGenerator, ConfirmQuestion, GeneratorOptions, InquirerQuestionType, StoreQuestion } from 'dotup-typescript-yeoman-generators';

export enum MyGeneratorQuestions {
  yourName = 'yourName',
  niceDay = 'niceDay'
}

/**
 * To start your generator, follow these steps:
 * 
 * 1. Install dependencies
 * 2. Build Project (Run gulp task Project)
 * 3. Open terminal and run 'npm link'
 * 4. Press F5 to run your generator
 * 
 */
export class MyGenerator extends BaseGenerator<MyGeneratorQuestions> {

  constructor(args: string | string[], options: GeneratorOptions<MyGeneratorQuestions>) {
    super(args, options);
    super.registerMethod(this);

    this.destinationRoot(this.destinationPath('tmp'));

    this.writeOptionsToAnswers(MyGeneratorQuestions);
  }

  async initializing(): Promise<void> {
    if (this.skipGenerator) { return; }

    // Your name
    this.addQuestion(
      new StoreQuestion(MyGeneratorQuestions.yourName, {
        message: `What's your name?`,
        type: InquirerQuestionType.input,
        validate: (v: string) => this.validateString(v)
      })
    );

    // How was your day?
    this.addQuestion(
      new ConfirmQuestion(MyGeneratorQuestions.niceDay, 'Had a nice day. You too?', false)
    );

  }

  async prompting(): Promise<void> {
    if (this.skipGenerator) { return; }

    await super.prompting();
  }

  async configuring(): Promise<void> {
    if (this.skipGenerator) { return; }

    if (this.answers.niceDay) {
      this.logGreen(`Okay ${this.answers.yourName}. Nice day.`);
    } else {
      this.logGreen(`Well ${this.answers.yourName}, not a nice day.`);
    }
  }
}
