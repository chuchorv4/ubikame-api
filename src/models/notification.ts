import { Schema, model, Model, Document } from 'mongoose'

export interface Notification extends Document {
  user: Schema.Types.ObjectId
  location: string
  message: string
  audio: string
  date: Date
  status: string
}

const NotificationSchema = new Schema ({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  location: {
    type: String,
    required: true,
    maxlength: 255
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


export const NotificationModel: Model<Notification> = model('Notification', NotificationSchema)