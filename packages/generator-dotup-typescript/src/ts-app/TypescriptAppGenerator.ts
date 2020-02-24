import { BaseGenerator, GeneratorOptions, SharedOptions } from 'dotup-typescript-yeoman-generators';
import _ from 'lodash';
import { TypescriptQuestions } from '../ts/TypescriptQuestions';

export class TypescriptAppGenerator extends BaseGenerator<TypescriptQuestions> {

  constructor(args: string | string[], options: GeneratorOptions<TypescriptQuestions>, sharedOptions?: SharedOptions<TypescriptQuestions>) {
    super(args, options);
    this.registerMethod(this);
    this.writeOptionsToAnswers(TypescriptQuestions);
  }

  async configuring(){
    await super.configuring();
  }

  async writing(){
    await super.writing();
  }
}
