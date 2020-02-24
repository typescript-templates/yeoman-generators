import { Nested, TypeSaveProperty } from 'dotup-ts-types';
import { BaseGenerator, ConfirmQuestion, GeneratorOptions, InquirerQuestionType, OptionalQuestion, ProjectType, Question, StoreQuestion, SharedOptions } from 'dotup-typescript-yeoman-generators';
import validateNpmPackageNameTyped from 'validate-npm-package-name-typed';
import { TypescriptAppGenerator } from '../ts-app/TypescriptAppGenerator';
import { TypescriptLibGenerator } from '../ts-lib/TypescriptLibGenerator';
import { TypescriptQuestions } from './TypescriptQuestions';
import _ from 'lodash';

export type PartialTypescriptQuestions = Partial<TypeSaveProperty<Nested<TypescriptQuestions, string>>>;

export class TypescriptGenerator extends BaseGenerator<TypescriptQuestions> {

  constructor(args: string | string[], options: GeneratorOptions<TypescriptQuestions>) {
    super(args, options);
    this.registerMethod(this);
    this.writeOptionsToAnswers(TypescriptQuestions);
  }

  async initializing(): Promise<void> {


    // Project type
    this.addQuestion(
      new StoreQuestion(TypescriptQuestions.projectType, {
        message: `Project type?`,
        type: InquirerQuestionType.list,
        choices: [
          {
            name: 'Node application (Typescript)',
            value: ProjectType.app
          },
          {
            name: 'Node library (Typescript)',
            value: ProjectType.lib
          }
        ],
        When: a => this.tryGetAnswer(TypescriptQuestions.projectType) === undefined

      })
    );

    // Project name
    this.addQuestion(
      new Question(TypescriptQuestions.projectName, {
        type: InquirerQuestionType.input,
        message: 'Project Name',
        default: this.getDefaultProjectName(),
        validate: (v: string) => this.validateString(v),
        acceptAnswer: v => {
          const accept = validateNpmPackageNameTyped(v.toString()).validForNewPackages;
          if (!accept) {
            this.logRed(`${v} is not a valid package name.`);
          }

          return true;
        },
        When: () => {
          return this.tryGetAnswer(TypescriptQuestions.projectName) === undefined
        }

      })
    );

    this.addQuestion(
      new OptionalQuestion(TypescriptQuestions.invalidProjectName, {
        type: InquirerQuestionType.confirm,
        message: 'Continue anyway?',
        default: 'N',
        acceptAnswer: accepted => {

          if (!accepted) {
            // Ask again for the project name
            this.currentStep = TypescriptQuestions.projectName;
          }

          return accepted;
        },
        When: () => {
          const name = this.tryGetAnswer(TypescriptQuestions.projectName);
          return !validateNpmPackageNameTyped(name).validForNewPackages;
        }
      })
    );

  }

  async prompting(): Promise<void> {
    const result = await super.prompting();

    // Application type generator
    switch (this.answers.projectType) {

      case ProjectType.app:

        this.composeWith(
          <any>{
            Generator: TypescriptAppGenerator,
            path: require.resolve('../ts-app/index')
          },
          {
            // [TsQuestions.projectName]: this.sharedOptions.getAnswer(TsQuestions.projectName),
            // 'sharedOptions': this.sharedOptions,
            [TypescriptQuestions.sourcePath]: this.answers.sourcePath,
            [TypescriptQuestions.targetPath]: this.answers.targetPath,
            [TypescriptQuestions.testPath]: this.answers.testPath,
            [TypescriptQuestions.docsPath]: this.answers.docsPath,
            [TypescriptQuestions.mainFile]: this.answers.mainFile || 'app.js',
            [TypescriptQuestions.typesFile]: this.answers.typesFile || 'app.d.ts'
          }
        );

        break;

      case ProjectType.lib:

        this.composeWith(
          <any>{
            Generator: TypescriptLibGenerator,
            path: require.resolve('../ts-lib/index')
          },
          {
            // [TsQuestions.projectName]: this.answers.projectName,
            // 'sharedOptions': this.sharedOptions,
            [TypescriptQuestions.sourcePath]: this.answers.sourcePath,
            [TypescriptQuestions.targetPath]: this.answers.targetPath,
            [TypescriptQuestions.testPath]: this.answers.testPath,
            [TypescriptQuestions.docsPath]: this.answers.docsPath,
            [TypescriptQuestions.mainFile]: this.answers.mainFile || 'index.js',
            [TypescriptQuestions.typesFile]: this.answers.typesFile || 'index.d.ts'
          }
        );

        break;

      // Only basic files
      case ProjectType.blank:
        break;

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

      default:
        throw new Error('Project type not implemented');
    }

  }

  async writing() {
    await super.writing();
  }
  // :( Refactor !
  // loadTemplateFiles(): void {
  //   super.loadTemplateFiles();
  //   const analyser = new ProjectPathAnalyser((...args) => this.templatePath(...args));
  //   const files = analyser.getDeepFiles(this.templatePath('..', '..', 'shared'));
  //   files.forEach(f => f.targetPath = this.destinationPath('tools', 'gulp', path.basename(f.targetPath)));
  //   this.projectFiles.templateFiles.push(...files);
  // }

  async end(): Promise<void> {
    // this.logGreen('Your project is ready.');

    // const q = {
    //   name: 'vscode',
    //   message: 'Should I start vscode?',
    //   default: 'Y',
    //   type: InquirerQuestionType.confirm
    // };

    // const result: ITypedProperty<boolean> = await inquirer.prompt(q);

    // if (result.vscode === true) {
    //   this.spawnCommandSync('code', [this.destinationPath()]);
    // }
  }

}
