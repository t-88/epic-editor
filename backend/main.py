from flask import Flask , request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/py",methods=["POST"])
@cross_origin()
def py():
    data = request.json
    return "Thx!"


app.run(debug=True)