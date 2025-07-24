from fastapi import FastAPI

from routes import routers


app = FastAPI()
app.include_router(routers)


@app.get("/")
def root():
    return {"message": "Welcome to the Weather Alert API for Farmers"}
