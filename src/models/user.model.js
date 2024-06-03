import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrupt from "bcrypt";

const UserSchema = new mongoose.Schema(
    {
        username:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname:
        {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar:
        {
            type: String,
            required: true,
        },
        coverImage:
        {
            type: String
        },
        watchHistory:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Video"
                }
            ],
        password:
        {
            type: String,
            required: [true, "password is required"]
        }
        ,
        refreshToken:
        {
            type: String
        }

    },
    {
        timestamps: true
    }
)

UserSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = bcrupt.hash(this.password, 10, next());
        }
        else {
            return;
        }
        next();
    }
    catch (err) {
        console.log("error in password bcrupt");
    }
})

//user defind method
UserSchema.methods.ispasswordCorrect = async function (password) {
    try {
        return await bcrupt.compare(password, this.password);
    }
    catch (err) {
        console.log("error in password check");
    }
}

UserSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({
        _id: this, _id,
        email: this.email,
        username: this.username
    }
        , process.env.ACCESS_TOKEN_SECREAT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })

    return token;
}

UserSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({
        _id: this._id
    },
        process.env.REFRASH_TOKEN_SECREAT,
        {
            expiresIn: process.env.REFRASH_TOKEN_EXPIRY
        })

        return token;
}
const User = mongoose.model("User", UserSchema);
export default User;