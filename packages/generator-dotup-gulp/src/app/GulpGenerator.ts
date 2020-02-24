import { BaseGenerator, ConfirmQuestion, GeneratorOptions, InquirerQuestionType, StoreQuestion } from 'dotup-typescript-yeoman-generators';

export enum GulpQuestions {
  sourcePath = 'sourcePath',
  testPath = 'testPath',
  targetPath = 'targetPath',
  docsPath = 'docsPath'
}

export class GulpGenerator extends BaseGenerator<GulpQuestions> {

  constructor(args: string | string[], options: GeneratorOptions<GulpQuestions>) {
    super(args, options);
    super.registerMethod(this);
    this.writeOptionsToAnswers(GulpQuestions);
  }

  async initializing(): Promise<void> {
    if (this.skipGenerator) { return; }

    this.addQuestion(
      new StoreQuestion(GulpQuestions.sourcePath, {
        message: `Source folder name?`,
        type: InquirerQuestionType.input,
        validate: (v: string) => this.validateString(v),
        When: _ => this.tryGetAnswer(GulpQuestions.sourcePath) === undefined
      })
    );

    this.addQuestion(
      new StoreQuestion(GulpQuestions.targetPath, {
        message: `Target folder name?`,
        type: InquirerQuestionType.input,
        validate: (v: string) => this.validateString(v),
        When: _ => this.tryGetAnswer(GulpQuestions.targetPath) === undefined
      })
    );

    this.addQuestion(
      new StoreQuestion(GulpQuestions.testPath, {
        message: `Test folder name?`,
        type: InquirerQuestionType.input,
        validate: (v: string) => this.validateString(v),
        When: _ => this.tryGetAnswer(GulpQuestions.testPath) === undefined
      })
    );

    this.addQuestion(
      new StoreQuestion(GulpQuestions.docsPath, {
        message: `Docs (typedoc) folder name?`,
        type: InquirerQuestionType.input,
        validate: (v: string) => this.validateString(v),
        When: _ => this.tryGetAnswer(GulpQuestions.docsPath) === undefined
      })
    );

  }

}
