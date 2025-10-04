from flask.cli import FlaskGroup
from app import app, db

if __name__ == "__main__":
    cli = FlaskGroup(app)
    cli()
    