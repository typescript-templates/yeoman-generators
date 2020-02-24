import { BaseGenerator, GeneratorOptions, SharedOptions, Question, InquirerQuestionType, StoreQuestion, ConfirmQuestion, ITypedProperty } from "@typescript-templates/typescript-yeoman-generators";
import _ from 'lodash';
import { TypescriptGenerator } from '../ts/TypescriptGenerator';
import validateNpmPackageNameTyped from 'validate-npm-package-name-typed';
import { MyQuestions } from './MyQuestions';
import { TypescriptQuestions } from '../ts/TypescriptQuestions';
import inquirer = require('inquirer');

export class MyGenerator extends BaseGenerator<MyQuestions> {


  constructor(args: string | string[], options: GeneratorOptions<MyQuestions>) {
    super(args, _.merge(options, { 'sharedOptions': new SharedOptions() }));
    super.registerMethod(this);
    this.writeOptionsToAnswers(MyQuestions);
    this.destinationRoot(this.destinationPath());
  }

  async initializing(): Promise<void> {

    // Project name
    this.addQuestion(
      new Question(MyQuestions.projectName, {
        message: 'Project Name',
        type: InquirerQuestionType.input,
        default: this.getDefaultProjectName(),
        validate: (v: string) => this.validateString(v),
        acceptAnswer: v => {
          const accept = validateNpmPackageNameTyped(v.toString()).validForNewPackages;
          if (!accept) {
            this.logRed(`${v} is not a valid package name.`);
          }

          return true;
        },
        When: _ => this.tryGetAnswer(MyQuestions.projectName) === undefined
      })
    );

    // Invalid project name
    this.addQuestion(
      new Question(MyQuestions.invalidProjectName, {
        message: 'Continue anyway?',
        type: InquirerQuestionType.confirm,
        default: 'N',
        acceptAnswer: accepted => {

          if (!accepted) {
            // Ask again for the project name
            this.currentStep = MyQuestions.projectName;
          }

          return accepted;
        },
        When: () => {
          const name = this.tryGetAnswer(MyQuestions.projectName);
          return !validateNpmPackageNameTyped(name).validForNewPackages;
        }
      })
    );

    // Create folder?
    this.addQuestion(
      new Question(MyQuestions.createFolder, {
        type: InquirerQuestionType.confirm,
        message: () => `Create folder '${this.answers.projectName}' ?`,
        default: 'Y',
        When: () => !this.destinationIsProjectFolder(this.answers.projectName),
        acceptAnswer: accepted => {
          if (accepted) {
            // Create new root
            this.destinationRoot(this.destinationPath(this.answers.projectName));
            this.logGreen(`Destination path changed to ${this.destinationPath()}`);
          }

          return accepted;
        }
      })
    );


    this.addQuestion(
      new ConfirmQuestion(MyQuestions.useGit, 'Configure git?')
    );

    // Use github?
    this.addQuestion(
      new StoreQuestion(MyQuestions.useGithub, {
        type: InquirerQuestionType.confirm,
        message: 'Configure github?',
        When: _ => this.answers.useGit.toString() === 'true'
      })
    );

  }

  async prompting(): Promise<void> {
    if (this.skipGenerator) { return; }

    await super.prompting();

    this.compose('generator-dotup-npm-package/generators/app');

    // Typescript generator
    this.composeWith(
      <any>{
        Generator: TypescriptGenerator,
        path: require.resolve('../ts/index')
      },
      {
        [TypescriptQuestions.sourcePath]: 'src',
        [TypescriptQuestions.targetPath]: 'dist',
        [TypescriptQuestions.testPath]: 'test',
        [TypescriptQuestions.docsPath]: 'docs'
      }
    );


    if (this.answers.useGit.toString() === 'true') {
      // TODO: remove rootPath
      // (<any>this.answers).rootPath = this.destinationPath(),
      this.compose('generator-dotup-git/generators/app');
    }

    if (this.answers.useGithub && this.answers.useGithub.toString() === 'true') {
      // Load git generator
      this.compose('generator-dotup-github/generators/app');
    }

    this.compose(
      'generator-dotup-gulp/generators/app',
      true,
      this.answers
    );
    // case ProjectType.ts_yo_generator:

    //   this.composeWith(
    //     <any>{
    //       Generator: YeomanGeneratorGenerator,
    //       path: require.resolve('../ts-yogen/index')
    //     },
    //     {
    //       [TsQuestions.projectName]: this.answers.projectName,
    //       [TsQuestions.sourcePath]: 'src',
    //       [TsQuestions.targetPath]: 'generators',
    //       [TsQuestions.testPath]: 'test',
    //       [TsQuestions.docsPath]: 'docs',
    //       [TsQuestions.mainFile]: 'app/index.js',
    //       [TsQuestions.typesFile]: 'app/index.d.ts'
    //     }
    //   );

    //   break;

  }

  async end(): Promise<void> {
    this.logGreen('Your project is ready.');

    const q = {
      name: 'vscode',
      message: 'Should I start vscode?',
      default: 'Y',
      type: InquirerQuestionType.confirm
    };

    const result: ITypedProperty<boolean> = await inquirer.prompt(q);

    if (result.vscode === true) {
      this.spawnCommandSync('code', [this.destinationPath()]);
    }
  }

}
