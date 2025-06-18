from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class AuthHandler:
    security = HTTPBearer()
    secret = os.getenv("SECRET_KEY")
    algorithm = "HS256"

    def encode_token(self, user_id: str):
        payload = {
            'exp': datetime.now() + timedelta(days=1),
            'iat': datetime.now(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm=self.algorithm
        )

    def decode_token(self, token: str):
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return payload['sub']
        except JWTError as e:
            raise HTTPException(status_code=401, detail=str(e))

    def auth_wrapper(self, auth: HTTPAuthorizationCredentials = Security(security)):
        return self.decode_token(auth.credentials)

auth_handler = AuthHandler() 