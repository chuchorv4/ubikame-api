import { Schema, model, Model, Document } from 'mongoose'

export interface Report extends Document {
  user: Schema.Types.ObjectId
  message: string
  audio: string
  date: Date
  status: string
}

const ReportSchema = new Schema ({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  message: {
    type: String,
    maxlength: 255
  },
  audio: {
    type: String,
    maxlength: 255
  },
  date: {
    type: Date
  },
  status: {
    type: String,
    default: 'NEW'
  }
}, {
  versionKey: false
})


export const ReportModel: Model<Report> = model('Report', ReportSchema)