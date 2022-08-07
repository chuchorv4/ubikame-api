import { Schema, model, Model, Document } from 'mongoose'

export interface Questionary extends Document {
  questionOne: Boolean
  questionTwo: Boolean
  questionThree: Boolean
  questionFour: Boolean
  questionFive: Boolean
  questionSix: Boolean
  questionSeven: Boolean
}

const QuestionarySchema = new Schema ({
  questionOne: {
    type: Boolean
  },
  questionTwo: {
    type: Boolean
  },
  questionThree: {
    type: Boolean
  },
  questionFour: {
    type: Boolean
  },
  questionFive: {
    type: Boolean
  },
  questionSix: {
    type: Boolean
  },
  questionSeven: {
    type: Boolean
  },
}, {
  versionKey: false
})


export const QuestionaryModel: Model<Questionary> = model('Questionary', QuestionarySchema)