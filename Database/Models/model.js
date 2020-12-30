const mongoose = require('mongoose');
const fuzzySearch = require('mongoose-fuzzy-searching');

const user = new mongoose.Schema({
  NAME: {
    type: String,
    required: [true, 'Name is required'],
  },
  EMAIL: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  PASSWORD: {
    type: String,
    required: [true, 'Password is required'],
  },
  PROFILE_PIC: {
    type: String,
  },
  PROFILE_PIC_ID: {
    type: String
  },
  PHONE_NUMBER: {
    type: Number
  },
  CITY: {
    type: String
  },
  STATE: {
    type: String
  },
  PROFESSION: {
    type: String
  },
  SERVICE_INTEREST: {
    type: [{
      SERVICE_ID: String,
      TITLE: String,
      POSTED_BY: String
    }]
  },
  PRODUCT_INTEREST: {
    type: [{
      PRODUCT_ID: String,
      TITLE: String,
      POSTED_BY: String
    }]
  },
  SERVICE_INTEREST_REC: {
    type: [{
      SERVICE_ID: String,
      TITLE: String,
      USERNAME: String,
      PHONE_NUMBER: Number,
    }]
  },
  PRODUCT_INTEREST_REC: {
    type: [{
      PRODUCT_ID: String,
      TITLE: String,
      USERNAME: String,
      PHONE_NUMBER: Number,
    }]
  }
});

const products = new mongoose.Schema({
  PRODUCT_ID: {
    type: String
  },
  CITY: {
    type: String
  },
  STATE: {
    type: String
  },
  TITLE: {
    type: String,
  },
  POSTED_BY: {
    type: String
  },
  EMAIL: {
    type: String
  },
  POSTED_BY_PIC: {
    type: String
  },
  DESCRIPTION: {
    type: String
  },
  CATEGORY: {
    type: String
  },
  PRICE: {
    type: String
  },
  NEGOTIABLE: {
    type: String
  },
  IMAGE: {
    type: Array
  }
});

const services = new mongoose.Schema({
  SERVICE_ID: {
    type: String,
  },
  TITLE: {
    type: String,
    required: [true, 'Name is required'],
  },
  CITY: {
    type: String
  },
  STATE: {
    type: String
  },
  POSTED_BY: {
    type: String
  },
  EMAIL: {
    type: String
  },
  POSTED_BY_PIC: {
    type: String
  },
  DESCRIPTION: {
    type: String
  },
  CATEGORY: {
    type: String
  },
  PRICE: {
    type: String
  },
  NEGOTIABLE: {
    type: String
  },
  IMAGE: {
    type: Array
  }
});

const askDesk = new mongoose.Schema({
  QUESTION_ID: {
    type: String
  },
  QUESTION: {
    type: String,
    required: [true, 'Question title is required'],
  },
  DESCRIPTION: {
    type: String
  },
  EMAIL: {
    type: String
  },
  QUESTION_BY: {
    type: String
  },
  QUESTION_BY_PIC: {
    type: String
  },
  QUESTION_BY_PROFESSION: {
    type: String
  },
  ANSWER: {
    type: [
      {
        ANSWER_ID: String,
        ANSWER_BY: String,
        PROFILE_PIC: String,
        PROFESSION: String,
        DESCRIPTION: String,
        LIKES: Number
      }
    ]
  }
});


const otp = new mongoose.Schema({
  NUMBER: {
    type: Number
  },
  OTP: {
    type: Number
  },
  ISVERIFIED: {
    type: Boolean
  }
});

products.plugin(fuzzySearch, { fields: ['TITLE', 'CATEGORY'] })
services.plugin(fuzzySearch, { fields: ['TITLE', 'CATEGORY'] })
askDesk.plugin(fuzzySearch, { fields: ['QUESTION'] })
module.exports.user = mongoose.model('user', user);
module.exports.products = mongoose.model('products', products);
module.exports.services = mongoose.model('services', services);
module.exports.askDesk = mongoose.model('askDesk', askDesk);
module.exports.otp = mongoose.model('otp', otp);
