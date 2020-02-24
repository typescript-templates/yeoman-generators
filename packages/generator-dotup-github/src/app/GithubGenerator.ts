import { GithubApiClient } from 'dotup-ts-github-api';
import { Nested, TypeSaveProperty } from 'dotup-ts-types';
import { BaseGenerator, InquirerQuestionType, IProperty, Question, StoreQuestion, GeneratorOptions, SharedOptions } from "@typescript-templates/typescript-yeoman-generators";
import { GithubQuestions } from './GithubQuestions';

type PartialQuestions = Partial<TypeSaveProperty<Nested<GithubQuestions, string>>>;

// Or export default!!
export class GithubGenerator extends BaseGenerator<GithubQuestions> {

  private repositoryExists: boolean;

  constructor(args: string | string[], options: GeneratorOptions<GithubQuestions>) {
    super(args, options);
    this.registerMethod(this);

    this.writeOptionsToAnswers(GithubQuestions);
  }

  async initializing(): Promise<void> {
    if (this.skipGenerator) { return; }

    const opt = <PartialQuestions>this.options;

    this.addQuestion(
      new StoreQuestion(GithubQuestions.userName, {
        message: 'Enter your name',
        default: opt.userName,
        type: InquirerQuestionType.input,
        When: x => this.tryGetAnswer(GithubQuestions.userName) === undefined
      })
    );

    this.addQuestion(
      new StoreQuestion(GithubQuestions.githubUserName, {
        message: 'Enter your github user name',
        default: opt.githubUserName,
        type: InquirerQuestionType.input,
        When: x => this.tryGetAnswer(GithubQuestions.githubUserName) === undefined
      })
    );

    this.addQuestion(
      new Question(GithubQuestions.password, {
        message: 'Enter your password',
        description: 'Github password',
        type: InquirerQuestionType.password
      })
    );

    this.addQuestion(
      new Question(GithubQuestions.projectName, {
        type: InquirerQuestionType.input,
        message: 'Enter repository name',
        description: 'Repository name',
        When: x => this.tryGetAnswer(GithubQuestions.projectName) === undefined
      })
    );

  }

  async configuring(): Promise<void> {
    if (this.skipGenerator) { return; }

    // If the repository exist, we do nothing
    const git = new GithubApiClient(this.answers.githubUserName, this.answers.password);
    this.repositoryExists = await git.ownRepositoryExists(this.answers.projectName);

    // Set remote origin url
    this.answers.githubUrl = git.getRepositoryUrl(this.answers.projectName);

    if (this.repositoryExists) {
      // Repo already exitst
      this.logYellow(`Github repository '${this.answers.projectName}' already exists.`);
    } else {

      // Create the repository
      const result = await git.createRepository({
        name: this.answers.projectName,
        private: false
      });

      const message = `statusCode: ${result.message.statusCode} | statusMessage: ${result.message.statusMessage}`;
      if (result.message.statusCode === 201) {
        this.logGreen(message);
      } else {
        this.logRed(`${message}. Could not create github repository.`);
      }
    }

  }

  // tslint:disable-next-line: no-reserved-keywords
  // async default(): Promise<void> {}
  // async writing(): Promise<void> {  }

  async install(): Promise<void> {
    if (this.skipGenerator) { return; }
  }

  async end(): Promise<void> {
    if (this.skipGenerator) { return; }

    const git = new GithubApiClient(this.answers.githubUserName, this.answers.password);
    const url = git.getRepositoryUrl(this.answers.projectName);

    this.spawnCommandSync('git', ['remote', 'add', 'origin', url], {
      cwd: this.destinationPath()
    });
  }

}
