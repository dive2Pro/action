const redis = require('redis')

const client = redis.createClient()


/**
 *
 * @param id key
 * @param data 保存的所有数据, 在 redis 中是扁平的字符串
 * @constructor
 */
function User(id, data) {
    this.id = id
    this.data = data
}


User.find = (id, fn) => {
    client.hgetall('user:' + id + ":data", (err, obj) => {
        if(err) {
            return fn(err)
        }
        fn(null, new User(id, obj))
    })
}


User.prototype.save = (fn) => {
    if(!this.id) {
        this.id = String(Math.random().substr(3))
    }

    client.hmset('user:' + this.id + ':data', this.data, fn)
}

User.prototype.follow = (user_id, fn) => {
    // queued up until an EXEC is issued
    client.multi()
        // sadd => set add
        .sadd('user:' + user_id + ':followers', this.id)
        .sadd('user:' + this.id + ':follows', user_id)
        .exec(fn)
}

User.prototype.unfollow = (user_id, fn) => {
    // queued up until an EXEC is issued
    client.multi()
    // srem -> set remove
        .srem('user:' + user_id + ':followers', this.id)
        .srem('user:' + this.id + ':follows', user_id)
        .exec(fn)
}

User.prototype.getFollowers = fn => {
    client.smembers(`user:${this.id}:followers`, fn)
}

User.prototype.getFollows = fn => {
    client.smembers(`user:${this.id}:follows`, fn)
}

User.prototype.getFriends = fn => {
    /**
     * 某个用户的id同时出现在另一个用户的关注和粉丝列表中时,
     * 他们就是朋友
     */
    client.sinter(`user:${this.id}:followers`, `user:${this.id}:follows`, fn)
}

/**
 *  redis 的哲学是扁平数据模型
 *        比如上面的demo中:
 *          followers 和 follows 在日常使用中, 会自然而然的想到使用 List 来处理
 *          但是在 redis 中, 使用一个 {'user:this.id:followers': set} 来保存
 *        这样, 保证了计算的速度非常的快
 */
