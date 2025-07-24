from fastapi import APIRouter
from . import ussd, web


routers = APIRouter()
routers.include_router(web.router, tags=["Web"])
routers.include_router(ussd.router, prefix="/ussd", tags=["USSD"])
