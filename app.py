"""Flask app for Cupcakes"""

from flask import Flask, request, jsonify, render_template

from models import Cupcake, db, connect_db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcake'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '123456789'

connect_db(app)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/api/cupcakes', methods=["GET"])
def show_all_cupcakes():
    cupcakes = [cupcake.serialize_cupcake() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes = cupcakes)

@app.route('/api/cupcakes/<int:cupcake_id>', methods=["GET"])
def show_cupcake_by_id(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    return (jsonify(cupcake = cupcake.serialize_cupcake()))

@app.route('/api/cupcakes', methods=["POST"])
def add_a_cupcake():

    resp = request.json

    cupcake = Cupcake(
        flavor = resp['flavor'],
        size = resp['size'],
        rating = resp['rating'],
        image = resp['image']
    )
    db.session.add(cupcake)
    db.session.commit()

    return (jsonify(cupcake = cupcake.serialize_cupcake()), 201)

@app.route('/api/cupcakes/<int:cupcake_id>', methods=["PATCH"])
def update_a_cupcake_by_id(cupcake_id):

    resp = request.json

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    cupcake.flavor = resp['flavor'],
    cupcake.size = resp['size'],
    cupcake.rating = resp['rating'],
    cupcake.image = resp['image']

    db.session.add(cupcake)
    db.session.commit()
    return jsonify(cupcake = cupcake.serialize_cupcake())

@app.route('/api/cupcakes/<int:cupcake_id>', methods=["DELETE"])
def remove_a_cupcake(cupcake_id):

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message = "Deleted")

