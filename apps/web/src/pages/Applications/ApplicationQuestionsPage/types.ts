interface QuestionResponse {
  id: string;
  questionId: string;
  answer: string;
}

export interface FormValues {
  screeningAnswers: QuestionResponse[];
  generalAnswers: QuestionResponse[];
  action: "continue" | "cancel";
}
