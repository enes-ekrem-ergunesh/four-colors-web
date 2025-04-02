import jwt
import datetime
from config import config
from dao.tokenDao import TokenDAO

class Token:
    dao = None

    def __init__(self, user_id=None, token=None, token_id=None, delta_seconds=None, record=None):
        if Token.dao is None:
            Token.dao = TokenDAO()

        if user_id and token:
            self._store_google_token(user_id, token)
        elif user_id and delta_seconds:
            self._generate_jwt(user_id, delta_seconds)
        elif token:
            self._load_by_token(token)
        elif token_id:
            self._load_by_token_id(token_id)
        elif record:
            self._set_attributes(record)
        else:
            raise ValueError("Not enough parameters to create a Token object")

    def _store_google_token(self, user_id, token):
        """Store Google OAuth token in the database"""
        pass

    def _generate_jwt(self, user_id, delta_seconds):
        """Generate a JWT token"""
        now = datetime.datetime.now(datetime.timezone.utc)
        exp = now + datetime.timedelta(seconds=delta_seconds)
        payload = {"user_id": user_id, "exp": exp, "iat": now}
        self.token = jwt.encode(payload, config.get('JWT_SECRET'), algorithm="HS256")
        self.user_id = user_id
        self.type = "jwt"
        self._save_to_db()
        self._load_by_token(self.token)

    def _load_by_token(self, token):
        """Retrieve token from the database"""
        token_data = self.dao.get_by_token(token)
        if not token_data:
            raise ValueError("Token not found in database")
        self._set_attributes(token_data)

    def _load_by_token_id(self, token_id):
        """Retrieve token from the database"""
        token_data = self.dao.get_by_id(token_id)
        if not token_data:
            raise ValueError(f"Token with id {token_id} not found in database")
        self._set_attributes(token_data)

    def _save_to_db(self):
        """Save token to database"""
        self.dao.create({
            "user_id": self.user_id,
            "token": self.token,
            "type": self.type,
        })

    def _set_attributes(self, data):
        """Set token attributes"""
        self.id = data['id']
        self.user_id = data.get("user_id")
        self.token = data.get("token")
        self.type = data.get("type")
        self.revoked_at = data.get("revoked_at")
        self.created_at = data.get("created_at")
        self.deleted_at = data.get("deleted_at")

    def revoke(self):
        """Revoke token"""
        self.dao.update(self.id, {"revoked_at": datetime.datetime.now(datetime.timezone.utc)})

    def status(self):
        """Validate token"""
        try:
            jwt.decode(self.token, config.get('JWT_SECRET'), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return 'expired'
        except jwt.InvalidTokenError:
            return 'invalid'
        if self.revoked_at:
            return 'revoked'
        return 'valid'

class TokenManager:
    def __init__(self):
        if Token.dao is None:
            Token.dao = TokenDAO()
        self.dao = Token.dao
        self.tokens: list[Token] = []

    def load_all_tokens(self):
        data = self.dao.get_all()
        for record in data:
            token = Token(record=record)
            self.tokens.append(token)