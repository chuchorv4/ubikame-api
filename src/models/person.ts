import { Schema, model, Model, Document } from 'mongoose'

export interface Person extends Document {
  gender: string
  name: string
  lastname: string
  active: boolean
  images: Array<string>
  address: string
  email: string
  phone: string
  password: string
  questions: Schema.Types.ObjectId
  tokenFireBase: string
}

const PersonSchema = new Schema({
  gender: {
    type: String,
    required: true,
    maxlength: 255
  },
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 255
  },
  active: {
    type: Boolean,
    default: false
  },
  images: [String],
  address: {
    type: String,
    required: true,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 255
  },
  questions: {
     type: Schema.Types.ObjectId,
    ref: 'Questionary',
  },
  tokenFireBase: {
    type: String
  }
}, {
  versionKey: false,
  timestamps: true
})

PersonSchema.index({ createdAt: 1 }, {
  expires: '1d',
  partialFilterExpression: {
    questions:{$ne:null}
  }
})

PersonSchema.methods.toJSON = function() {
 let obj = this.toObject()
 delete obj.password
 return obj
}

export const PersonModel: Model<Person> = model('Person', PersonSchema)