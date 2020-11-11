const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://lkuser:FCdvRWUfibd0gu7a@cluster0.hcwmo.mongodb.net/srilanka?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
