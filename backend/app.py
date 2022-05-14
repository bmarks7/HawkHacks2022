from distutils.command.upload import upload
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hawkhacks.db'

db = SQLAlchemy(app)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    speaker = db.Column(db.String)
    title = db.Column(db.String)
    tweet = db.Column(db.Boolean)
    text = db.Column(db.String)

db.create_all()

file1 = File(speaker='Steve', title="My Speech", tweet=True, text="hello everyone")
db.session.add(file1)
db.session.commit()


headers = {
    "authorization": "7e026873492c4259a6f42a5564a306e4",
    "content-type": "application/json"
}

def read_file(file):
    while True:
        data = file.read(5242880)
        if not data:
            break
        yield data

@app.route("/", methods=['POST'])
def home():
    json = request.form
    
    file = request.files['file']

    upload_response = requests.post("https://api.assemblyai.com/v2/upload", headers=headers, data = read_file(file))
    upload_url = upload_response.json()['upload_url']

    transcript_request = {
        'audio_url': upload_url
    }
    transcript_response = requests.post("https://api.assemblyai.com/v2/transcript", json=transcript_request, headers=headers)
    id = transcript_response.json()['id']

    while True:
        polling_response = requests.get('https://api.assemblyai.com/v2/transcript/' + id, headers=headers)
        if polling_response.json()['status'] == 'completed':
            print(polling_response.json()['text'])
            break

    return "audio uploaded"

if __name__ == "__main__":
    app.run()

