const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/smart-brain-api',{
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : false
})