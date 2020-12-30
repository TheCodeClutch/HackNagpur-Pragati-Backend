const router = require("express").Router();
const message = require("../Helpers/messaging").message;
const User = require("../Database/Models/model.js").user;
const AskDesk = require("../Database/Models/model.js").askDesk;
const middleware = require("../Helpers/auth-middleware").session;

// ADD QUESTION
router.post("/add/question", middleware, (request, response) => {
  const d = new Date()
  const questionId = "AD" + String(d.getTime());
  const ques = new AskDesk({
    QUESTION_ID: questionId,
    QUESTION: request.body.title,
    QUESTION_BY: request.decode.name,
    QUESTION_BY_PIC: request.decode.profile_pic,
    QUESTION_BY_PROFESSION: request.decode.profession,
    DESCRIPTION: request.body.description,
    EMAIL: request.decode.email,
  });
  ques.save((err) => {
    if (err) {
      response.status(200).json({
        err: "There was some error while adding question",
      });
    } else {
      response.status(200).json({
        message: "The question was successfully added.",
      });
    }
  });
});

// ADD ANSWER
router.post("/add/answer", middleware, (request, response) => {
  const d = new Date();
  const answerId = "AD" + String(d.getTime());
  AskDesk.findOneAndUpdate(
    {
      QUESTION_ID: request.body.questionId,
    },
    {
      $push: {
        ANSWER: {
          ANSWER_ID: answerId,
          PROFILE_PIC: request.decode.profile_pic,
          ANSWER_BY: request.decode.name,
          LIKES: 0,
          PROFESSION: request.decode.profession,
          DESCRIPTION: request.body.answer,
        },
      },
    }
  )
    .then((doc) => {
      User.findOne({
        EMAIL: doc.EMAIL,
      })
        .then((res) => {
          message(
            res.PHONE_NUMBER,
            `Hello ${res.NAME}, ${request.decode.name} just posted an answer to your question with title - ${doc.QUESTION}.
                    . Visit website to view more such related content.`
          )
            .then((res) => {
              response.status(200).json({
                message: "Your answer was successfully added.",
              });
            })
            .catch((err) => {
              response.status(200).json({
                message: "Your answer was successfully added.",
              });
            });
        })
        .catch((err) => {
          response.status(200).json({
            message: "Your answer was successfully added.",
          });
        });
    })
    .catch((err) => {
      response.status(200).json({
        err: "There was some error while adding your answer.",
      });
    });
});

// TO GET MY QUESTIONS
router.get("/myquestions", middleware, (request, response) => {
  AskDesk.find({
    EMAIL: request.decode.email,
  })
    .then((doc) => {
      response.status(200).json({
        message: doc,
      });
    })
    .catch((err) => {
      response.status(200).json({
        err: "There was some error while fetching the data",
      });
    });
});

// TO DELETE QUESTIONS AND IT'S ANSWERS
router.delete("/delete", (request, response) => {
  AskDesk.findOneAndRemove({
    QUESTION_ID: request.body.questionId,
  })
    .then((res) => {
      if (res) {
        response.status(200).json({
          message: "The question and it's answers were successfully deleted.",
        });
      } else {
        response.status(200).json({
          err: "No such product exist.",
        });
      }
    })
    .catch((err) => {
      response.status(200).json({
        err: "There was some error while deleting the question.",
      });
    });
});

// SEARCH QUESTION
router.get("/search", async (request, response) => {
  const questions = await AskDesk.fuzzySearch(request.query.q);
  response.status(200).json({
    message: questions,
  });
});

module.exports = router;
