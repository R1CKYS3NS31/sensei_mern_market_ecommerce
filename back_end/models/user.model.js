const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required"
        },
        email: {
            type: String,
            trim: true,
            unique: 'Email already exists',
            match: [/.+\@.+\..+/, 'Please fill a valid email address'],
            required: 'Email is required'
        },
        hashed_password: {
            type: String,
            required: "Password is required"
        },
        salt: String,
        updatedAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)
userSchema
    .virtual('password').set((password) => {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    }).get(() => {
        return this._password
    })

userSchema.path('hashed_password').validate((v) => {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: (password) => {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: () => {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

module.exports = mongoose.model("User", userSchema)