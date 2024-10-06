export class ICPQuestionsDto {
  readonly usp: string;
  readonly industry: string;
  readonly customerSupport: string;
}

export class CreatePersonaDto {
  readonly name: string;
  readonly icpQuestions: ICPQuestionsDto;
}

export class UpdatePersonaDto {
  readonly name?: string;
  readonly icpQuestions?: Partial<ICPQuestionsDto>;
}
