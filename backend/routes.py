from flask import Blueprint
from flask import jsonify
from flask import request
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
 
import os

from .db import client as db_client
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
db = SQLAlchemy(app)

blueprint = Blueprint('api', __name__)


@blueprint.route('/recycling-data')
def get_recycling_data():
    data = [row.to_dict() for row in db_client.get_all_recycling_data()]
    return jsonify(data)

@blueprint.route('/add-recycling-data', methods = ["POST"])
def add_recycling_data():
    db.session.add(request.data)
    db.session.commit()