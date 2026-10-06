from pydantic import BaseModel
from typing import Optional, List, Dict, Union

class SurveyResponse(BaseModel):
    honey_pot: Optional[str] = None
    answers: Dict[str, Union[str, List[str], int, None]]

class LoginRequest(BaseModel):
    username: str
    password: str
