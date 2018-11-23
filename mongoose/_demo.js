const mongoose = require('mongoose')
const Schema = mongoose.Schema

const {ObjectId} = Schema

mongoose.connect('mongodb://localhost:27017/_blogs')


const Comments = new Schema({
    title: String,
    body: String,
    date: Date
})

const BlogPost = new Schema({
    author: ObjectId,
    title: {type: String, default: 'Untitled', index: true},
    body: String,
    date: Date,
    comments: [Comments],
    meta: {
        votes: Number,
        favs: Number
    }
})

// 更复杂的索引使用 Scheme 的静态 index 方法
// BlogPost.index({})

// moogoose 默认会到模型名字使用小写复数形式
const Post = mongoose.model('BlogPost', BlogPost)




