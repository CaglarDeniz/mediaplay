from flask import Flask
from flask import request
from flask.wrappers import Response
from mediaplay import MediaPlay

# from pdb import set_trace
from random import randint


app = Flask(__name__)


@app.route("/video", methods=['POST','GET'])
def video_request():

    if request.method == 'POST' : # if its a POST request
        print(f"A download request for {request.form['videoLinkString']} was made")
        med = MediaPlay() 

        cookie_file_string = request.files['cookieFile'].read().decode('utf-8')
        cookies = med.parse_cookies_from_string(cookie_string=cookie_file_string)
        med.add_cookies(cookies)

        videoName = "demo" + str(randint(1,100)) if request.form['nameString'] == "" else request.form['nameString'] 

        med.download_video(videoLink=request.form['videoLinkString'],videoName=videoName)
        resp = Response("Succesfully downloaded video")
        resp.headers['Access-Control-Allow-Origin'] = "http://localhost:3000"
        return resp

    return Response("Some funky thing happened")

@app.route("/playlist", methods=['POST','GET'])
def playlist_request(): 

    # set_trace()

    if request.method == 'POST': # if its a POST request
        print(f"A download request for {request.form['playlistLinkString']} was made")

        med = MediaPlay(playlistLink=request.form['playlistLinkString'])
        
        cookie_file_string = request.files['cookieFile'].read().decode('utf-8')
        cookies = med.parse_cookies_from_string(cookie_string=cookie_file_string)
        med.add_cookies(cookies)

        videoName = request.form['nameString']

        med.download_playlist(videoName)

        resp = Response("Succesfully downloaded playlist")
        resp.headers['Access-Control-Allow-Origin'] = "http://localhost:3000"
        return resp

if __name__ == "__main__" : 
    app.run(host="0.0.0.0")

