import jwt
from enum import unique
from fastapi import Depends, FastAPI,HTTPException,status
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from tortoise import fields
from tortoise.contrib.fastapi import register_tortoise
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.models import Model


JWT_SEACRET = "myjwtseacret"

app = FastAPI()

# corsの設定
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# スキーマ
class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(50,unique=True)
    password_hash = fields.CharField(128)


    # ハッシュ値の比較
    def verify_password(self,password):
        return bcrypt.verify(password,self.password_hash)

User_Pydantic = pydantic_model_creator(User,name="User")
UserIn_Pydantic = pydantic_model_creator(User,name="UserIn",exclude_readonly=True)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def authenticate_user(username:str,password:str):
    # ユーザーを比較して認証（usernameとpassword）
    user = await User.get(username = username)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user



async def get_current_user(token:str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token,JWT_SEACRET,algorithms=["HS256"])
            user = await User.get(id=payload.get("id"))
        except:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="invalid username or passrowd")

        return await user



@app.post("/token")
async def genrate_token(form_data:OAuth2PasswordRequestForm = Depends()):
    print(form_data)
    # トークンの生成
    user = await authenticate_user(form_data.username,form_data.password)

    if not user:
        return { "error":"invalid credentials"}

    user_obj = await User_Pydantic.from_tortoise_orm(user)
    token =  jwt.encode(user_obj.dict(),JWT_SEACRET)
    return {"access_token":token,"token_type":"bearer"}


@app.get("/user/me",response_model=User_Pydantic)
# 認証情報を取得
async def get_user(user:User_Pydantic = Depends(get_current_user)):
    return user


@app.post("/users",response_model=User_Pydantic)
# ユーザー情報をDBに保存
async def create_user(user:UserIn_Pydantic):
    # パスワードをハッシュ化
    user_obj = User(username=user.username,password_hash=bcrypt.hash(user.password_hash))
    await user_obj.save()
    return await user_obj




register_tortoise(
    app,
    db_url="postgres://nishiura:nishiura@localhost:5432",
    modules={"models":["main"]},
    generate_schemas=True,
    add_exception_handlers=True
)