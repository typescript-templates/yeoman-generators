import { BaseGenerator, GeneratorOptions, SharedOptions } from "@typescript-templates/typescript-yeoman-generators";
import _ from 'lodash';
import { TypescriptQuestions } from '../ts/TypescriptQuestions';

export class TypescriptLibGenerator extends BaseGenerator<TypescriptQuestions> {

  constructor(args: string | string[], options: GeneratorOptions<TypescriptQuestions>, sharedOptions?: SharedOptions<TypescriptQuestions>) {
    super(args, options);
    this.registerMethod(this);
    this.writeOptionsToAnswers(TypescriptQuestions);
  }

}
