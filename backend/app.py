from distutils.command.upload import upload
from hashlib import new
from multiprocessing import pool
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pprint
import tweepy
from requests_oauthlib import OAuth1Session
import os
import json

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hawkhacks.db'

db = SQLAlchemy(app)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    speaker = db.Column(db.String)
    location = db.Column(db.String)
    description = db.Column(db.String)
    tweet = db.Column(db.Boolean, default=False)
    text = db.Column(db.String)
    entities = db.relationship('Entity', backref='file')
    highlights = db.relationship('Highlight', backref='file')
    chapters = db.relationship('Chapter', backref='file')

class Entity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)
    file_id = db.Column(db.Integer, db.ForeignKey('file.id'))

class Highlight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)
    file_id = db.Column(db.Integer, db.ForeignKey('file.id'))

class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    summary = db.Column(db.String)
    headline = db.Column(db.String)
    gist = db.Column(db.String)
    file_id = db.Column(db.Integer, db.ForeignKey('file.id'))

db.create_all()


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
def storeFile():
    json = request.form
    
    file = request.files['file']

    upload_response = requests.post("https://api.assemblyai.com/v2/upload", headers=headers, data = read_file(file))
    upload_url = upload_response.json()['upload_url']

    transcript_request = {
        'audio_url': upload_url,
        'auto_highlights': True,
        'auto_chapters': True,
        'entity_detection': True,
    }
    transcript_response = requests.post("https://api.assemblyai.com/v2/transcript", json=transcript_request, headers=headers)
    id = transcript_response.json()['id']

    while True:
        polling_response = requests.get('https://api.assemblyai.com/v2/transcript/' + id, headers=headers)
        if polling_response.json()['status'] == 'completed':
            pprint.pprint(polling_response.json())
            response = polling_response.json()

            tweetVal = False
            if json['tweet'] == 'True':
                tweetVal = True

            new_file = File(
                title=json['title'], 
                speaker=json['speaker'], 
                location=json['location'], 
                description=json['description'], 
                tweet=tweetVal, 
                text=response['text'])
            db.session.add(new_file)
            db.session.commit()

            highlights = response['auto_highlights_result']['results']
            for highlight in highlights:
                new_highlight = Highlight(text = highlight['text'], file=new_file)
                db.session.add(new_highlight)
            
            entities = response['entities']
            for entity in entities:
                new_entity = Entity(text = entity['text'], file=new_file)
                db.session.add(new_entity)

            chapters = response['chapters']
            for chapter in chapters:
                new_chapter = Chapter(summary = chapter['summary'], headline = chapter['headline'], gist = chapter['gist'], file=new_file)
                db.session.add(new_chapter)

            db.session.commit()
            break

    return "audio uploaded"

@app.route("/<searchVal>/<location>", methods=['GET'])
def search(searchVal, location):
    results = []
    if location == 'nowhere':
        text_matches = File.query.filter(File.text.contains(searchVal)).all()
    else:
        text_matches = File.query.filter(File.text.contains(searchVal), File.location.contains(location)).all()

    for match in text_matches:
        match_entities = []
        for entity in match.entities:
            match_entities.append({"text": entity.text, "file_id": entity.file_id})

        match_highlights = []
        for highlight in match.highlights:
            match_highlights.append({"text": highlight.text, "file_id": highlight.file_id})

        match_chapters = []
        for chapter in match.chapters:
            match_chapters.append({"summary": chapter.summary, "headline": chapter.headline, "gist": chapter.gist, "file_id": chapter.file_id})

        match_obj = {
         "id": match.id,
         "title": match.title,
         "speaker": match.speaker, 
         "location": match.location, 
         "description": match.description, 
         "tweet": match.tweet,
         "text": match.text,
         "chapters": match_chapters,
         "entities": match_entities,
         "highlights": match_highlights}
        results.append(match_obj)

    entity_matches = Entity.query.filter(Entity.text.contains(searchVal)).all()
    for match in entity_matches:
        if location == 'nowhere':
            matching_file = File.query.filter(File.id == match.file_id).first()
        else:
            matching_file = File.query.filter(File.id == match.file_id, File.location.contains(location)).first()

        if matching_file != []:
            for entity in matching_file.entities:
                match_entities.append({"text": entity.text, "file_id": entity.file_id})

            match_highlights = []
            for highlight in matching_file.highlights:
                match_highlights.append({"text": highlight.text, "file_id": highlight.file_id})

            match_chapters = []
            for chapter in matching_file.chapters:
                match_chapters.append({"summary": chapter.summary, "headline": chapter.headline, "gist": chapter.gist, "file_id": chapter.file_id})

            match_obj = {
            "id": matching_file.id,
            "title": matching_file.title,
            "speaker": matching_file.speaker, 
            "location": matching_file.location, 
            "description": matching_file.description, 
            "tweet": matching_file.tweet,
            "text": matching_file.text,
            "chapters": match_chapters,
            "entities": match_entities,
            "highlights": match_highlights}

            alreadySelected = False
            for result in results:
                if result['id'] == match_obj['id']:
                    alreadySelected = True

            if alreadySelected == False:
                results.append(match_obj)


    return jsonify({'results': results})

@app.route("/getOne/<id>", methods=['GET'])
def getOne(id):
    file = File.query.filter(File.id == id).first()

    match_entities = []
    for entity in file.entities:
            match_entities.append({"text": entity.text, "file_id": entity.file_id})

    match_highlights = []
    for highlight in file.highlights:
        match_highlights.append({"text": highlight.text, "file_id": highlight.file_id})

    match_chapters = []
    for chapter in file.chapters:
        match_chapters.append({"summary": chapter.summary, "headline": chapter.headline, "gist": chapter.gist, "file_id": chapter.file_id})

    file_obj = {
    "id": file.id,
    "title": file.title,
    "speaker": file.speaker, 
    "location": file.location, 
    "description": file.description, 
    "tweet": file.tweet,
    "text": file.text,
    "chapters": match_chapters,
    "entities": match_entities,
    "highlights": match_highlights}

    return jsonify({'file': file_obj})

if __name__ == "__main__":
    app.run()

