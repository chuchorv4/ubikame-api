import { Schema, model, Model, Document } from 'mongoose'

export interface Role extends Document {
  name: string
  permissions: Array<string>
}

const RoleSchema = new Schema ({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 255
  },
  permissions: [String]
}, {
  versionKey: false
})


export const RoleModel: Model<Role> = model('Role', RoleSchema)