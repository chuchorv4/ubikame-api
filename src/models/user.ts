import { Schema, model, Model, Document } from 'mongoose'

export interface User extends Document {
  username: string
  password: string
  role: Schema.Types.ObjectId
}

const UserSchema = new Schema ({
  username: {
    type: String,
    required: true,
    trim: true,
    unique:true,
    lowercase: true,
    minlength: 3,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 255
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
}, {
  versionKey: false
})

UserSchema.methods.toJSON = function() {
 let obj = this.toObject()
 delete obj.password
 return obj
}

export const UserModel: Model<User> = model('User', UserSchema)