const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacob',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    validate: {
      validator(v) {
        return validator.isStrongPassword(v);
      },
      message: (props) => `${props.value} is not a valid password!`,
    },
    select: false,
  },
});

// userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
//   return this.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Incorrect email or password'));
//       }
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(new Error('Incorrect email or password'));
//           }

//           return user;
//         });
//     });
// };

module.exports = mongoose.model('user', userSchema);
